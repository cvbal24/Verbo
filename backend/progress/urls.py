from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.progress_stats, name='progress_stats'),
]