from django.db import models

class DialogMission(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class DialogNode(models.Model):
    mission = models.ForeignKey(DialogMission, related_name="nodes", on_delete=models.CASCADE)
    text = models.TextField()                  # Original script
    romaji_text = models.TextField(blank=True) # Pronunciation
    english_text = models.TextField(blank=True)# Translation
    is_user_turn = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text[:30]}..."


class DialogChoice(models.Model):
    node = models.ForeignKey(DialogNode, related_name="choices", on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)   # Script
    romaji_text = models.CharField(max_length=200, blank=True)
    english_text = models.CharField(max_length=200, blank=True)
    next_node = models.ForeignKey(DialogNode, null=True, blank=True, on_delete=models.SET_NULL)
    feedback = models.TextField(blank=True)

    def __str__(self):
        return f"{self.choice_text} → {self.next_node}"