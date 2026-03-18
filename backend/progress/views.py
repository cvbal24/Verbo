from django.db.models import Avg
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import CompletedLesson, Lesson, ProgressSnapshot, QuizResult, UserVocabulary, Vocabulary
from .serializers import (
    CompletedLessonSerializer,
    LessonSerializer,
    ProgressSnapshotSerializer,
    QuizResultSerializer,
    UserVocabularySerializer,
    VocabularySerializer,
)


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().order_by("language", "title")
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]


class CompletedLessonViewSet(viewsets.ModelViewSet):
    serializer_class = CompletedLessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CompletedLesson.objects.filter(user=self.request.user).order_by("-completed_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class QuizResultViewSet(viewsets.ModelViewSet):
    serializer_class = QuizResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizResult.objects.filter(user=self.request.user).order_by("-taken_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class VocabularyViewSet(viewsets.ModelViewSet):
    queryset = Vocabulary.objects.all().order_by("word")
    serializer_class = VocabularySerializer
    permission_classes = [IsAuthenticated]


class UserVocabularyViewSet(viewsets.ModelViewSet):
    serializer_class = UserVocabularySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserVocabulary.objects.filter(user=self.request.user).order_by("-learned_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProgressSnapshotViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProgressSnapshotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProgressSnapshot.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"])
    def generate(self, request):
        lessons_completed = CompletedLesson.objects.filter(user=request.user).count()
        quizzes = QuizResult.objects.filter(user=request.user)
        quizzes_taken = quizzes.count()
        avg_score = quizzes.aggregate(avg=Avg("score"))["avg"] or 0.0
        vocabulary_learned = UserVocabulary.objects.filter(user=request.user).count()

        snapshot = ProgressSnapshot.objects.create(
            user=request.user,
            lessons_completed=lessons_completed,
            quizzes_taken=quizzes_taken,
            average_quiz_score=float(avg_score),
            vocabulary_learned=vocabulary_learned,
        )
        return Response(ProgressSnapshotSerializer(snapshot).data)