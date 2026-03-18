from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import SystemConfigViewSet

router = DefaultRouter()
router.register(r"system", SystemConfigViewSet, basename="system-config")

urlpatterns = [
    path("", include(router.urls)),
]
