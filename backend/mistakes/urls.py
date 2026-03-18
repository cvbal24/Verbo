from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MistakeViewSet

router = DefaultRouter()
router.register(r"entries", MistakeViewSet, basename="mistake")

urlpatterns = [
    path("", include(router.urls)),
]
