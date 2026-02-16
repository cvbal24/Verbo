from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GrammarCheckViewSet

router = DefaultRouter()
router.register(r'checks', GrammarCheckViewSet, basename="grammarcheck")

urlpatterns = [
    path("", include(router.urls)),
]