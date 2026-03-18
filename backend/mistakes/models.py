from django.db import models

class Mistake(models.Model):
    username = models.CharField(max_length=100)
    incorrect_text = models.TextField()
    correct_text = models.TextField()
    explanation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username