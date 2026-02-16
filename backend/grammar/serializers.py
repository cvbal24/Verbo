from rest_framework import serializers
from .models import GrammarCheck, GrammarError

class GrammarCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrammarCheck
        fields = ["id", "input_text", "romaji_text", "english_text", "corrected_text", "feedback", "created_at"]

class GrammarErrorSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrammarError
        fields = ["id", "error_code", "description", "example_correct", "example_incorrect"]
