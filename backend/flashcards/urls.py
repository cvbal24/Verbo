from django.urls import path
from . import views

urlpatterns = [
    path('review-list/', views.review_list, name='review_list'),
]