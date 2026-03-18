from django.db import models

class PlacementTest(models.Model):
    user_name = models.CharField(max_length=100)
    level = models.CharField(max_length=50)
    score = models.IntegerField()

    def __str__(self):
        return f"{self.user_name} - {self.level}"