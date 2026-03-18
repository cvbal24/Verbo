from rest_framework import viewsets
from django.db.models import Q
from .models import Lesson, Word
from .serializers import LessonSerializer, WordSerializer

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().order_by("language", "title")
    serializer_class = LessonSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        language = self.request.query_params.get("language")
        if language:
            queryset = queryset.filter(language__iexact=language)
        return queryset

class WordViewSet(viewsets.ModelViewSet):
    queryset = Word.objects.select_related("lesson").all().order_by("lesson_id", "script")
    serializer_class = WordSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        lesson = self.request.query_params.get("lesson")
        difficulty = self.request.query_params.get("difficulty")
        tag = self.request.query_params.get("tag")
        language = self.request.query_params.get("language")
        q = self.request.query_params.get("q")

        if lesson:
            queryset = queryset.filter(lesson_id=lesson)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        if tag:
            queryset = queryset.filter(tags__icontains=tag)
        if language:
            queryset = queryset.filter(lesson__language__iexact=language)
        if q:
            queryset = queryset.filter(
                Q(script__icontains=q) |
                Q(romaji__icontains=q) |
                Q(english__icontains=q)
            )

        return queryset