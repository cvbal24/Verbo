from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import PlacementTest
from .serializers import PlacementTestSerializer


def _recommend_level(score, total):
	if total <= 0:
		return "beginner"
	ratio = score / total
	if ratio >= 0.85:
		return "advanced"
	if ratio >= 0.6:
		return "intermediate"
	return "beginner"


class PlacementTestViewSet(viewsets.ModelViewSet):
	serializer_class = PlacementTestSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		return PlacementTest.objects.filter(user=self.request.user).order_by("-taken_at")

	def perform_create(self, serializer):
		score = serializer.validated_data.get("score", 0)
		total = serializer.validated_data.get("total", 100)
		level = serializer.validated_data.get("level") or _recommend_level(score, total)
		language = serializer.validated_data.get("language", "english")
		recommended_course = f"{language.title()} {level.title()} Starter"
		serializer.save(user=self.request.user, level=level, recommended_course=recommended_course)
