from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    
    native_language = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="The user's first/native language"
    )
    target_language = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="The language the user is learning"
    )
    learning_level = models.CharField(
        max_length=20,
        choices=[
            ("beginner", "Beginner"),
            ("intermediate", "Intermediate"),
            ("advanced", "Advanced"),
        ],
        default="beginner",
        help_text="Current learning level"
    )

    def __str__(self):
        return self.username