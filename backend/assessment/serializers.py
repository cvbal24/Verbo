from rest_framework import serializers
from .models import Assessment, Question, Answer, UserResponse


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "question", "text", "romaji_text", "english_text", "is_correct"]


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "assessment", "text", "romaji_text", "english_text", "difficulty", "answers"]


class AssessmentSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = ["id", "title", "description", "questions"]


class UserResponseSerializer(serializers.ModelSerializer):
    question_detail = QuestionSerializer(source="question", read_only=True)
    selected_answer_detail = AnswerSerializer(source="selected_answer", read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = UserResponse
        fields = [
            "id",
            "user",
            "question",
            "question_detail",
            "selected_answer",
            "selected_answer_detail",
            "answer_text",
            "score",
            "feedback",
            "created_at",
        ]
        read_only_fields = ["user", "score", "feedback", "created_at"]