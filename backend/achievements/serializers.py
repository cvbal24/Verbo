from rest_framework import serializers

from .models import Achievement


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ["id", "user", "category", "title", "milestone", "metadata", "created_at"]
        read_only_fields = ["user", "created_at"]
