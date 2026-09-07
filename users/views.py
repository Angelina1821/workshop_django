from django.shortcuts import render
from rest_framework import generics
from rest_framework.authtoken.models import Token

from .serializers import UserRegistrationSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        Token.objects.create(user=user)
