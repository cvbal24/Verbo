from rest_framework import serializers

from .models import UserPreference


class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = [
            "id",
            "user",
            "learning_style",
            "difficulty",
            "guided_prompts_enabled",
            "step_by_step_enabled",
            "current_path",
            "current_step",
            "navigation_progress",
            "updated_at",
        ]
        read_only_fields = ["user", "updated_at"]
