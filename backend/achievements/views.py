from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Achievement
from .serializers import AchievementSerializer


class AchievementViewSet(viewsets.ModelViewSet):
	serializer_class = AchievementSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		return Achievement.objects.filter(user=self.request.user).order_by("-created_at")

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)

	@action(detail=False, methods=["get"], url_path="journal")
	def journal(self, request):
		queryset = self.get_queryset()
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)
