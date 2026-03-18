from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import IdiomViewSet

router = DefaultRouter()
router.register(r"items", IdiomViewSet, basename="idiom")

urlpatterns = [
    path("", include(router.urls)),
]
