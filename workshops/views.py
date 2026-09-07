from rest_framework import generics

from .models import Workshop
from .serializers import WorkshopSerializer

from users.permissions import IsAdminRole, IsAdminOrReadOnly

class WorkshopListView(generics.ListAPIView):
    queryset = Workshop.objects.all()
    serializer_class = WorkshopSerializer

class WorkshopCreateView(generics.CreateAPIView):
    queryset = Workshop.objects.all()
    serializer_class = WorkshopSerializer
    permission_classes = [IsAdminRole]

class WorkshopDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Workshop.objects.all()
    serializer_class = WorkshopSerializer
    permission_classes = [IsAdminOrReadOnly]