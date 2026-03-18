from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from .models import Flashcard, FlashcardReview
from .serializers import FlashcardReviewSerializer, FlashcardSerializer


class FlashcardViewSet(viewsets.ModelViewSet):
    queryset = Flashcard.objects.select_related("lesson").all().order_by("language", "id")
    serializer_class = FlashcardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        language = self.request.query_params.get("language")
        lesson = self.request.query_params.get("lesson")
        if language:
            queryset = queryset.filter(language__iexact=language)
        if lesson:
            queryset = queryset.filter(lesson_id=lesson)
        return queryset


class FlashcardReviewViewSet(viewsets.ModelViewSet):
    serializer_class = FlashcardReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FlashcardReview.objects.select_related("flashcard").filter(user=self.request.user).order_by("next_review")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def due(self, request):
        reviews = self.get_queryset().filter(next_review__lte=timezone.now())
        serializer = self.get_serializer(reviews, many=True)
        return Response({"cards_due": serializer.data})

    @action(detail=True, methods=["post"])
    def submit_review(self, request, pk=None):
        review = self.get_object()
        quality = request.data.get("quality", 3)
        try:
            quality_value = int(quality)
        except (TypeError, ValueError):
            return Response({"error": "quality must be an integer between 0 and 5"}, status=status.HTTP_400_BAD_REQUEST)

        review.schedule_next(quality=quality_value)
        return Response(self.get_serializer(review).data)