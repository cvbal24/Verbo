from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Mistake
from .serializers import MistakeSerializer


class MistakeViewSet(viewsets.ModelViewSet):
	serializer_class = MistakeSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		queryset = Mistake.objects.filter(user=self.request.user).order_by("-created_at")
		mistake_type = self.request.query_params.get("mistake_type")
		unresolved_only = self.request.query_params.get("unresolved")
		if mistake_type:
			queryset = queryset.filter(mistake_type=mistake_type)
		if unresolved_only and unresolved_only.lower() in {"1", "true", "yes"}:
			queryset = queryset.filter(is_resolved=False)
		return queryset

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)

	@action(detail=True, methods=["post"], url_path="mark-reviewed")
	def mark_reviewed(self, request, pk=None):
		mistake = self.get_object()
		mistake.review_count += 1
		mistake.last_reviewed_at = timezone.now()
		mistake.save(update_fields=["review_count", "last_reviewed_at"])
		return Response(self.get_serializer(mistake).data)

	@action(detail=True, methods=["post"], url_path="resolve")
	def resolve(self, request, pk=None):
		mistake = self.get_object()
		mistake.is_resolved = True
		mistake.save(update_fields=["is_resolved"])
		return Response(self.get_serializer(mistake).data)
