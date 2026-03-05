from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from django.db.models import Avg

from .models import Assessment, Question, Answer, UserResponse
from .serializers import (
    AssessmentSerializer,
    QuestionSerializer,
    AnswerSerializer,
    UserResponseSerializer,
)
from progress.models import UserProgress, Achievement
import random
from rest_framework.permissions import IsAuthenticated

class VocabularyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class UserResponseViewSet(viewsets.ModelViewSet):
    queryset = UserResponse.objects.all()
    serializer_class = UserResponseSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user_response = UserResponse.objects.get(id=response.data["id"])

        feedback = "Try again!"
        score = 0

        if user_response.selected_answer:
            if user_response.selected_answer.is_correct:
                score = 1
                feedback = "Correct!"
            else:
                feedback = "Incorrect, review the explanation."
        elif user_response.answer_text:
            score = 0
            feedback = "Answer recorded. Awaiting AI evaluation."

        user_response.score = score
        user_response.feedback = feedback
        user_response.save()

        # Adaptive difficulty
        question = user_response.question
        if score == 1:
            question.difficulty = min(question.difficulty + 1, 5)
        else:
            question.difficulty = max(question.difficulty - 1, 1)
        question.save()

        # Log progress
        user = request.user if request.user.is_authenticated else None
        if user and question.assessment:
            total_questions = question.assessment.questions.count()
            answered = UserResponse.objects.filter(
                user=user, question__assessment=question.assessment
            ).count()
            completed = answered >= total_questions

            UserProgress.objects.update_or_create(
                user=user,
                assessment=question.assessment,
                defaults={
                    "score": score,  # could be averaged later
                    "completed": completed,
                },
            )

            if completed:
                Achievement.objects.get_or_create(
                    user=user,
                    title="Quiz Completed",
                    defaults={
                        "description": f"You finished {question.assessment.title}!"
                    },
                )

        return Response(UserResponseSerializer(user_response).data)


class AdaptiveAssessmentViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def next_question(self, request):
        user = request.user if request.user.is_authenticated else None
        if not user:
            return Response({"error": "Authentication required"}, status=403)

        # Calculate learner’s average score
        responses = UserResponse.objects.filter(user=user)
        avg_score = responses.aggregate(avg=Avg("score"))["avg"] or 0

        # Adjust difficulty based on performance
        if avg_score < 0.5:   # since score is 0 or 1, use fraction not percentage
            difficulty = 1  # easy
        elif avg_score < 0.8:
            difficulty = 2  # medium
        else:
            difficulty = 3  # hard

        # Pick a random question at the chosen difficulty
        question = Question.objects.filter(difficulty=difficulty).order_by("?").first()

        if not question:
            return Response({"error": "No questions available"}, status=404)

        return Response({
            "question_id": question.id,
            "text": question.text,
            "difficulty": difficulty,
        })