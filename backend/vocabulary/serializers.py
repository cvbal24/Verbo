from rest_framework import serializers
from .models import Lesson, Word


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            "id",
            "language",
            "title",
            "description",
            "created_at",
        ]


class WordSerializer(serializers.ModelSerializer):
    lesson = serializers.PrimaryKeyRelatedField(queryset=Lesson.objects.all())

    class Meta:
        model = Word
        fields = [
            "id",
            "lesson",
            "script",
            "romaji",
            "english",
            "difficulty",
            "tags",
            "mastery_count",
            "created_at",
        ]