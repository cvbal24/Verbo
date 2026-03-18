from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import UserPreference
from .serializers import UserPreferenceSerializer


class UserPreferenceViewSet(viewsets.ModelViewSet):
	serializer_class = UserPreferenceSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		return UserPreference.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)

	@action(detail=False, methods=["get", "patch"], url_path="me")
	def me(self, request):
		preference, _ = UserPreference.objects.get_or_create(user=request.user)

		if request.method.lower() == "patch":
			serializer = self.get_serializer(preference, data=request.data, partial=True)
			serializer.is_valid(raise_exception=True)
			serializer.save()
			return Response(serializer.data)

		return Response(self.get_serializer(preference).data, status=status.HTTP_200_OK)
