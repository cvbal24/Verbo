from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PlacementTestViewSet

router = DefaultRouter()
router.register(r"tests", PlacementTestViewSet, basename="placement-test")

urlpatterns = [
    path("", include(router.urls)),
]
