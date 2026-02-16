from django.db import models
from django.conf import settings

class GrammarCheck(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    input_text = models.TextField()                   # Original script
    romaji_text = models.TextField(blank=True)        # Pronunciation
    english_text = models.TextField(blank=True)       # Translation
    corrected_text = models.TextField(blank=True)
    feedback = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"GrammarCheck by {self.user if self.user else 'Anonymous'}"
    
class GrammarError(models.Model):
    language = models.CharField(max_length=50)  # e.g., "english", "japanese", "spanish"
    error_code = models.CharField(max_length=50)  # e.g., "verb_conjugation"
    description = models.TextField()
    example_correct = models.TextField()
    example_incorrect = models.TextField()

    def __str__(self):
        return f"{self.language} - {self.error_code}"
