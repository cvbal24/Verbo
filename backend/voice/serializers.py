from rest_framework import serializers
from .models import VoiceRecording

class VoiceRecordingSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoiceRecording
        fields = ["id", "user", "exercise_id", "audio_file", "uploaded_at", "score"]
        read_only_fields = ["uploaded_at", "score"]
