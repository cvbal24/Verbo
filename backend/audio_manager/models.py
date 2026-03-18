from django.db import models
from django.conf import settings

class AudioFile(models.Model):
    TYPE_CHOICES = [
        ("pronunciation", "Pronunciation"),
        ("slow_mode", "Slow Mode"),
        ("voice_recording", "Voice Recording"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=100)
    language = models.CharField(max_length=50, default="english")
    audio_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="pronunciation")
    is_slow_mode = models.BooleanField(default=False)
    linked_word = models.ForeignKey("vocabulary.Word", on_delete=models.SET_NULL, null=True, blank=True)
    transcript = models.TextField(blank=True, default="")
    duration_seconds = models.FloatField(default=0)
    metadata = models.JSONField(default=dict, blank=True)
    file = models.FileField(upload_to='audio/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title