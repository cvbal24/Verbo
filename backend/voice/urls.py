from rest_framework.routers import DefaultRouter
from .views import VoiceRecordingViewSet

router = DefaultRouter()
router.register(r"voice-recordings", VoiceRecordingViewSet, basename="voice-recordings")

urlpatterns = router.urls