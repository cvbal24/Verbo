from django.db import models

class Achievement(models.Model):
    username = models.CharField(max_length=100)
    milestone = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.milestone