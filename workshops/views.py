from rest_framework import generics

from .models import Workshop, Classroom
from .serializers import WorkshopSerializer,ClassroomSerializer

from users.permissions import IsAdminRole, IsAdminOrReadOnly

#Создание, просмотр мастер-классов
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

# Создание, просмотр классов(кабинетов)
class ClassroomCreateView(generics.CreateAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [IsAdminRole]

class ClassroomListView(generics.ListAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer