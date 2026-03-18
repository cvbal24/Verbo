from django.db import models

class UserPreference(models.Model):
    username = models.CharField(max_length=100)
    learning_style = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50)

    def __str__(self):
        return self.username