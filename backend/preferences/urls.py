from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import UserPreferenceViewSet

router = DefaultRouter()
router.register(r"preferences", UserPreferenceViewSet, basename="user-preference")

urlpatterns = [
    path("", include(router.urls)),
]
