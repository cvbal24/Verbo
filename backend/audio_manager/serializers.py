from rest_framework import serializers

from .models import AudioFile


class AudioFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = AudioFile
        fields = [
            "id",
            "user",
            "title",
            "language",
            "audio_type",
            "is_slow_mode",
            "linked_word",
            "transcript",
            "duration_seconds",
            "metadata",
            "file",
            "file_url",
            "uploaded_at",
        ]
        read_only_fields = ["user", "uploaded_at", "file_url"]

    def get_file_url(self, obj):
        request = self.context.get("request")
        if not obj.file:
            return ""
        if request is None:
            return obj.file.url
        return request.build_absolute_uri(obj.file.url)
