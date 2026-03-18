from rest_framework import serializers

from .models import Mistake


class MistakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mistake
        fields = [
            "id",
            "user",
            "mistake_type",
            "source_module",
            "incorrect_text",
            "correct_text",
            "explanation",
            "review_count",
            "last_reviewed_at",
            "is_resolved",
            "created_at",
        ]
        read_only_fields = ["user", "review_count", "last_reviewed_at", "created_at"]
