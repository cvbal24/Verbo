from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import VoiceRecording
from .serializers import VoiceRecordingSerializer

class VoiceRecordingViewSet(viewsets.ModelViewSet):
    serializer_class = VoiceRecordingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return VoiceRecording.objects.filter(user=self.request.user).order_by("-uploaded_at")

    def perform_create(self, serializer):
        # Save recording
        recording = serializer.save(user=self.request.user)

        # Compare with reference audio (pseudo-code)
        reference_path = f"reference_audio/{recording.exercise_id}.wav"
        score = self.compare_audio(recording.audio_file.path, reference_path)

        recording.score = score
        recording.save()

    def compare_audio(self, user_audio_path, reference_audio_path):
        # Placeholder: implement actual comparison logic
        # Could use libraries like librosa, pydub, or speech recognition APIs
        return 0.85  # Example similarity score