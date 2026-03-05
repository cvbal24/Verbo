from django.db import models
from django.conf import settings

class VoiceRecording(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    exercise_id = models.CharField(max_length=100)  # link to the practice item
    audio_file = models.FileField(upload_to="voice_recordings/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    score = models.FloatField(null=True, blank=True)  # comparison result
