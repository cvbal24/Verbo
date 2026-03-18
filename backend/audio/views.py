from pathlib import Path
from uuid import uuid4

from django.utils.text import slugify
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse
from django.conf import settings

try:
    from gtts import gTTS
except ImportError:  # pragma: no cover - handled at runtime if dependency is missing
    gTTS = None


SUPPORTED_EXTENSIONS = ("mp3", "wav", "m4a", "ogg")
DEFAULT_SLOW_SPEED = "0.75"


def _sanitize_speed(raw_speed):
    if raw_speed is None:
        return DEFAULT_SLOW_SPEED
    speed = str(raw_speed).strip()
    allowed = {"0.5", "0.6", "0.7", "0.75", "0.8", "0.85", "0.9"}
    return speed if speed in allowed else DEFAULT_SLOW_SPEED


def _content_type_for_extension(extension):
    return {
        "mp3": "audio/mpeg",
        "wav": "audio/wav",
        "m4a": "audio/mp4",
        "ogg": "audio/ogg",
    }.get(extension, "application/octet-stream")


def _find_existing_audio_path(candidates):
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None

class AudioClipViewSet(viewsets.ViewSet):
    """
    ViewSet to serve pronunciation clips.

    Expected file layout:
    - Normal clip: media/audio/{clip_id}.{ext}
    - Slow clip: media/audio/slow/{clip_id}_{speed}x.{ext}

    Example:
    - /audio/clips/konnichiwa/           -> normal clip
    - /audio/clips/konnichiwa/?slow=true -> slow clip at default 0.75x
    - /audio/clips/konnichiwa/slow/?speed=0.6 -> slow clip at 0.6x
    """

    def retrieve(self, request, pk=None):
        slow_mode = str(request.query_params.get("slow", "false")).strip().lower() in {"1", "true", "yes"}
        speed = _sanitize_speed(request.query_params.get("speed"))

        return self._serve_clip(pk=pk, slow_mode=slow_mode, speed=speed)

    @action(detail=False, methods=["post"], url_path="generate")
    def generate(self, request):
        """
        Generate normal and slow TTS clips and store them in media/audio.

        Request body:
        - text: string (required)
        - clip_id: string (optional)
        - language: string (optional, default=en)
        - speed: string (optional, default=0.75)
        """
        if gTTS is None:
            return Response(
                {"error": "TTS generation dependency is unavailable. Install gTTS."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        text = str(request.data.get("text", "")).strip()
        if not text:
            return Response({"error": "text is required"}, status=status.HTTP_400_BAD_REQUEST)

        language = str(request.data.get("language", "en")).strip().lower() or "en"
        speed = _sanitize_speed(request.data.get("speed"))

        requested_clip_id = str(request.data.get("clip_id", "")).strip()
        base_id = slugify(requested_clip_id) if requested_clip_id else ""
        clip_id = base_id or f"clip-{uuid4().hex[:12]}"

        media_root = Path(settings.MEDIA_ROOT)
        audio_dir = media_root / "audio"
        slow_dir = audio_dir / "slow"
        audio_dir.mkdir(parents=True, exist_ok=True)
        slow_dir.mkdir(parents=True, exist_ok=True)

        normal_path = audio_dir / f"{clip_id}.mp3"
        slow_path = slow_dir / f"{clip_id}_{speed}x.mp3"

        try:
            gTTS(text=text, lang=language, slow=False).save(str(normal_path))
            gTTS(text=text, lang=language, slow=True).save(str(slow_path))
        except ValueError:
            return Response(
                {"error": f"Unsupported language code: {language}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            return Response(
                {"error": "Failed to generate audio from text."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        normal_url = request.build_absolute_uri(f"{settings.MEDIA_URL}audio/{clip_id}.mp3")
        slow_url = request.build_absolute_uri(f"{settings.MEDIA_URL}audio/slow/{clip_id}_{speed}x.mp3")

        return Response(
            {
                "clip_id": clip_id,
                "language": language,
                "speed": speed,
                "normal_url": normal_url,
                "slow_url": slow_url,
                "serve_endpoints": {
                    "normal": request.build_absolute_uri(f"/audio/clips/{clip_id}/"),
                    "slow": request.build_absolute_uri(f"/audio/clips/{clip_id}/slow/?speed={speed}"),
                },
            },
            status=status.HTTP_201_CREATED,
        )

    def _serve_clip(self, pk, slow_mode, speed):

        media_root = Path(settings.MEDIA_ROOT)
        normal_candidates = [media_root / "audio" / f"{pk}.{ext}" for ext in SUPPORTED_EXTENSIONS]
        slow_candidates = [media_root / "audio" / "slow" / f"{pk}_{speed}x.{ext}" for ext in SUPPORTED_EXTENSIONS]

        selected_path = _find_existing_audio_path(slow_candidates if slow_mode else normal_candidates)
        if selected_path is None and slow_mode:
            # Fallback to normal clip when a slow variant is unavailable.
            selected_path = _find_existing_audio_path(normal_candidates)

        if selected_path is None:
            return Response({"error": "Audio clip not found"}, status=status.HTTP_404_NOT_FOUND)

        extension = selected_path.suffix.lstrip(".").lower()
        content_type = _content_type_for_extension(extension)

        return FileResponse(open(selected_path, "rb"), content_type=content_type)

    @action(detail=True, methods=["get"], url_path="slow")
    def slow(self, request, pk=None):
        speed = _sanitize_speed(request.query_params.get("speed"))
        return self._serve_clip(pk=pk, slow_mode=True, speed=speed)