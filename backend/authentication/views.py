from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .serializers import RegisterSerializer, UserSerializer
from .models import CustomUser


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "user": UserSerializer(user).data,
            "tokens": {
                "accessToken": str(refresh.access_token),
                "refreshToken": str(refresh),
                "expiresAt": refresh.access_token.payload["exp"],
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        user = authenticate(
            username=request.data.get("username"),
            password=request.data.get("password")
        )
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "tokens": {
                "accessToken": str(refresh.access_token),
                "refreshToken": str(refresh),
                "expiresAt": refresh.access_token.payload["exp"],
            }
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Optional: blacklist the refresh token if using JWT blacklist app
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"user": UserSerializer(request.user).data}, status=status.HTTP_200_OK)


class RefreshView(APIView):
    def post(self, request):
        try:
            refresh = RefreshToken(request.data.get("refreshToken"))
            return Response({
                "accessToken": str(refresh.access_token),
                "expiresAt": refresh.access_token.payload["exp"],
            }, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)