from django.conf import settings
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import SystemConfig
from .serializers import SystemConfigSerializer


class SystemConfigViewSet(viewsets.ModelViewSet):
	queryset = SystemConfig.objects.all().order_by("key")
	serializer_class = SystemConfigSerializer
	permission_classes = [IsAdminUser]

	@action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
	def deployment_status(self, request):
		return Response(
			{
				"debug": settings.DEBUG,
				"allowed_hosts": settings.ALLOWED_HOSTS,
				"has_secure_ssl_redirect": bool(getattr(settings, "SECURE_SSL_REDIRECT", False)),
				"media_url": settings.MEDIA_URL,
			}
		)
