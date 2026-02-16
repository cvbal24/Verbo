from rest_framework import serializers
from .models import DialogMission, DialogNode, DialogChoice

class DialogChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DialogChoice
        fields = ["id", "choice_text", "romaji_text", "english_text", "next_node", "feedback"]

class DialogNodeSerializer(serializers.ModelSerializer):
    choices = DialogChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = DialogNode
        fields = ["id", "text", "romaji_text", "english_text", "is_user_turn", "choices"]

class DialogMissionSerializer(serializers.ModelSerializer):
    nodes = DialogNodeSerializer(many=True, read_only=True)

    class Meta:
        model = DialogMission
        fields = ["id", "title", "description", "created_at", "nodes"]