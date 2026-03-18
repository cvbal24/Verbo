from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls')),
    path('assessment/', include('assessment.urls')),
    path('grammar/', include('grammar.urls')),
    path('dialog/', include('dialog.urls')),
    path('ai-chat/', include('ai_chat.urls')),
    path('ai-content/', include('ai_content.urls')),
    path('voice/', include('voice.urls')),
    path('audio/', include('audio.urls')),
    path('progress/', include('progress.urls')),
    path('flashcards/', include('flashcards.urls')),
    path('vocabulary/', include('vocabulary.urls')),
    path('placement/', include('placement.urls')),
    path('preferences/', include('preferences.urls')),
    path('achievements/', include('achievements.urls')),
    path('idioms/', include('idioms.urls')),
    path('mistakes/', include('mistakes.urls')),
    path('audio-manager/', include('audio_manager.urls')),
    path('core-config/', include('core_config.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
