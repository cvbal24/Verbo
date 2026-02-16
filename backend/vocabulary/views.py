from rest_framework import viewsets
from .models import Lesson, Word
from .serializers import LessonSerializer, WordSerializer

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class WordViewSet(viewsets.ModelViewSet):
    queryset = Word.objects.all()
    serializer_class = WordSerializer

    def get_queryset(self):
        queryset = Word.objects.all()
        lesson = self.request.query_params.get("lesson")
        difficulty = self.request.query_params.get("difficulty")
        tag = self.request.query_params.get("tag")
        language = self.request.query_params.get("lang")  # NEW

        if lesson:
            queryset = queryset.filter(lesson_id=lesson)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        if tag:
            queryset = queryset.filter(tags__icontains=tag)

        # Optional: filter by language field
        if language == "script":
            queryset = queryset.exclude(script__isnull=True).exclude(script__exact="")
        elif language == "romaji":
            queryset = queryset.exclude(romaji__isnull=True).exclude(romaji__exact="")
        elif language == "english":
            queryset = queryset.exclude(english__isnull=True).exclude(english__exact="")

        return queryset