from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GrammarCheckViewSet, check_grammar

router = DefaultRouter()
router.register(r'checks', GrammarCheckViewSet, basename="grammarcheck")

urlpatterns = [
    path("check/", check_grammar, name="check-grammar"),
    path("", include(router.urls)),
]