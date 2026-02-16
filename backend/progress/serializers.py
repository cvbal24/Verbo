from rest_framework import serializers
from .models import UserProgress, Achievement

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = [
            "id",
            "user",
            "lesson",
            "mission",
            "current_node",
            "assessment",
            "completed",
            "score",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ["id", "user", "title", "description", "earned_at"]