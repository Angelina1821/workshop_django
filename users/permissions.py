from rest_framework.permissions import BasePermission

from .models import User

#Создание прав пользователя
class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == User.Role.ADMIN
        )

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        return (
            request.user.is_authenticated
            and request.user.role == User.Role.ADMIN
        )