from rest_framework.routers import DefaultRouter
from .views import AudioClipViewSet

router = DefaultRouter()
router.register(r"clips", AudioClipViewSet, basename="audio-clip")

urlpatterns = router.urls