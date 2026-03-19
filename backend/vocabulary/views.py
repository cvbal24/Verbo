from django.db.models import Count, Q
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Lesson, Word
from .serializers import LessonSerializer, WordSerializer
from .bootstrap import ensure_starter_content


class AvailableLanguagePacksView(APIView):
    """
    List only languages that currently have lesson content (at least one word).
    """

    def get(self, request):
        if not Word.objects.exists():
            ensure_starter_content()

        language_rows = (
            Word.objects.select_related("lesson")
            .values("lesson__language")
            .annotate(
                lesson_count=Count("lesson", distinct=True),
                word_count=Count("id"),
            )
            .order_by("lesson__language")
        )

        data = [
            {
                "language": row["lesson__language"],
                "lesson_count": row["lesson_count"],
                "word_count": row["word_count"],
            }
            for row in language_rows
            if row["lesson__language"]
        ]

        return Response(data)

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().order_by("language", "title")
    serializer_class = LessonSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        language = self.request.query_params.get("language")

        if not Lesson.objects.exists():
            ensure_starter_content()

        if language:
            if not queryset.filter(language__iexact=language).exists():
                ensure_starter_content(language=language)
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

        if not Word.objects.exists():
            ensure_starter_content()

        if lesson:
            queryset = queryset.filter(lesson_id=lesson)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        if tag:
            queryset = queryset.filter(tags__icontains=tag)
        if language:
            if not queryset.filter(lesson__language__iexact=language).exists():
                ensure_starter_content(language=language)
            queryset = queryset.filter(lesson__language__iexact=language)
        if q:
            queryset = queryset.filter(
                Q(script__icontains=q) |
                Q(romaji__icontains=q) |
                Q(english__icontains=q)
            )

        return queryset