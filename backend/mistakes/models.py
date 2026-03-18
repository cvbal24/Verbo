from django.db import models
from django.conf import settings

class Mistake(models.Model):
    TYPE_CHOICES = [
        ("quiz", "Quiz"),
        ("grammar", "Grammar"),
        ("vocabulary", "Vocabulary"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mistakes", null=True, blank=True)
    mistake_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="quiz")
    source_module = models.CharField(max_length=80, blank=True, default="")
    incorrect_text = models.TextField()
    correct_text = models.TextField()
    explanation = models.TextField()
    review_count = models.IntegerField(default=0)
    last_reviewed_at = models.DateTimeField(null=True, blank=True)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user)