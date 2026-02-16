from django.contrib import admin
from .models import Assessment, Question, Answer, UserResponse

admin.site.register(Assessment)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(UserResponse)