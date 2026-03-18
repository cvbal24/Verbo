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
    lesson_title = serializers.CharField(source="lesson.title", read_only=True)
    lesson_language = serializers.CharField(source="lesson.language", read_only=True)

    class Meta:
        model = Word
        fields = [
            "id",
            "lesson",
            "lesson_title",
            "lesson_language",
            "script",
            "romaji",
            "english",
            "audio_url",
            "difficulty",
            "tags",
            "mastery_count",
            "created_at",
        ]