from django.db import models

class Idiom(models.Model):
    phrase = models.CharField(max_length=200)
    meaning = models.TextField()
    example = models.TextField()
    language = models.CharField(max_length=50)

    def __str__(self):
        return self.phrase