from rest_framework import serializers
from .models import CompletedLesson, Lesson, ProgressSnapshot, QuizResult, UserVocabulary, Vocabulary


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["id", "title", "language"]


class CompletedLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedLesson
        fields = ["id", "user", "lesson", "completed_at"]
        read_only_fields = ["user", "completed_at"]


class QuizResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizResult
        fields = ["id", "user", "lesson", "score", "total", "taken_at"]
        read_only_fields = ["user", "taken_at"]


class VocabularySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vocabulary
        fields = ["id", "word", "meaning"]


class UserVocabularySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserVocabulary
        fields = ["id", "user", "vocab", "learned_at"]
        read_only_fields = ["user", "learned_at"]


class ProgressSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressSnapshot
        fields = [
            "id",
            "user",
            "lessons_completed",
            "quizzes_taken",
            "average_quiz_score",
            "vocabulary_learned",
            "created_at",
        ]
        read_only_fields = ["user", "created_at"]