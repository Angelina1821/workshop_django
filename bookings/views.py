from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Booking
from .serializers import BookingSerializer
from .services import create_booking

# создание записи на мастер-класс
class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        create_booking(
            user=self.request.user,
            workshop=serializer.validated_data['workshop']
        )

# просмотр своих записей, админ может смотреть записи всех пользователей
class BookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Booking.objects.select_related(
            'user',
            'workshop',
            'workshop__classroom'
        )

        if self.request.user.role == 'ADMIN':
            return queryset

        return queryset.filter(
            user=self.request.user
        )

#отмена своей записи
class BookingCancelView(generics.DestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(
            user=self.request.user,
            status=Booking.Status.ACTIVE
        )

    def perform_destroy(self, instance):
        instance.status = Booking.Status.CANCELLED
        instance.save()