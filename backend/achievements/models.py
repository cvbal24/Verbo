from django.db import models
from django.conf import settings

class Achievement(models.Model):
    CATEGORY_CHOICES = [
        ("milestone", "Milestone"),
        ("first_spoken_sentence", "First Spoken Sentence"),
        ("mastered_word", "Mastered Word"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="achievements", null=True, blank=True)
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES, default="milestone")
    title = models.CharField(max_length=150, default="Achievement", null=True, blank=True)
    milestone = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.title}"