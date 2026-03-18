from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Idiom
from .serializers import IdiomSerializer


class IdiomViewSet(viewsets.ModelViewSet):
	queryset = Idiom.objects.select_related("lesson").all().order_by("target_language", "phrase")
	serializer_class = IdiomSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		queryset = super().get_queryset()
		target_language = self.request.query_params.get("target_language")
		lesson = self.request.query_params.get("lesson")
		if target_language:
			queryset = queryset.filter(target_language__iexact=target_language)
		if lesson:
			queryset = queryset.filter(lesson_id=lesson)
		return queryset
