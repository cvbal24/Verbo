from rest_framework import viewsets
from rest_framework.response import Response
from django.http import FileResponse
import os

class AudioClipViewSet(viewsets.ViewSet):
    """
    ViewSet to serve audio clips.
    Frontend controls playback speed (normal/slow).
    """

    def retrieve(self, request, pk=None):
        file_path = f"media/audio/{pk}.mp3"
        if not os.path.exists(file_path):
            return Response({"error": "File not found"}, status=404)

        return FileResponse(open(file_path, "rb"), content_type="audio/mpeg")