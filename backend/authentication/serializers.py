from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    bio = serializers.CharField(required=False, allow_blank=True, write_only=True)
    is_premium = serializers.BooleanField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'bio', 'is_premium')

    def create(self, validated_data):
        bio = validated_data.pop('bio', '')
        is_premium = validated_data.pop('is_premium', False)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
        )

        if hasattr(user, 'bio'):
            user.bio = bio
        if hasattr(user, 'is_premium'):
            user.is_premium = is_premium
        if hasattr(user, 'bio') or hasattr(user, 'is_premium'):
            user.save()

        return user


class UserSerializer(serializers.ModelSerializer):
    bio = serializers.SerializerMethodField()
    is_premium = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'bio', 'is_premium')

    def get_bio(self, obj):
        return getattr(obj, 'bio', '')

    def get_is_premium(self, obj):
        return bool(getattr(obj, 'is_premium', False))