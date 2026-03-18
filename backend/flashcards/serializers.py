from rest_framework import serializers

from .models import Flashcard, FlashcardReview


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ["id", "question", "answer", "language", "lesson"]


class FlashcardReviewSerializer(serializers.ModelSerializer):
    flashcard_detail = FlashcardSerializer(source="flashcard", read_only=True)

    class Meta:
        model = FlashcardReview
        fields = [
            "id",
            "user",
            "flashcard",
            "flashcard_detail",
            "last_reviewed",
            "next_review",
            "interval",
            "repetitions",
            "ease_factor",
        ]
        read_only_fields = ["user", "last_reviewed", "next_review", "interval", "repetitions", "ease_factor"]
