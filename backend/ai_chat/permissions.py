from rest_framework.permissions import BasePermission

class IsPremiumUser(BasePermission):
    """
    Allows access only to premium subscribers.
    """

    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and getattr(user, "is_premium", False)