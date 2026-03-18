from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import AudioFile
from .serializers import AudioFileSerializer


class AudioFileViewSet(viewsets.ModelViewSet):
	serializer_class = AudioFileSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		queryset = AudioFile.objects.filter(user=self.request.user).order_by("-uploaded_at")
		audio_type = self.request.query_params.get("audio_type")
		language = self.request.query_params.get("language")
		slow_mode = self.request.query_params.get("is_slow_mode")
		if audio_type:
			queryset = queryset.filter(audio_type=audio_type)
		if language:
			queryset = queryset.filter(language__iexact=language)
		if slow_mode and slow_mode.lower() in {"1", "true", "yes"}:
			queryset = queryset.filter(is_slow_mode=True)
		return queryset

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
