from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'id',
            'user',
            'workshop',
            'status',
            'created_at',
        ]
        read_only_fields = [
            'user',
            'status',
            'created_at',
        ]

    # проверка даты мастеркласса, ограничение на запись прошедшего
    def validate_workshop(self, workshop):
        from django.utils import timezone

        if workshop.date <= timezone.now():
            raise serializers.ValidationError(
                'Нельзя записаться на прошедший мастер-класс.'
            )
        return workshop

    
    def validate(self, attrs):
        workshop = attrs['workshop']
        user = self.context['request'].user

    # проверка существующей записи пользователя на мастер-класс
        existing_booking = Booking.objects.filter(
            user=user,
            workshop=workshop,
            status=Booking.Status.ACTIVE
        ).exists()

        if existing_booking:
            raise serializers.ValidationError(
                'Вы уже записаны на этот мастер-класс.'
            )
        
    #проверка мест на мастер-класс и огранричение записи на заполненный
        active_bookings = Booking.objects.filter(
            workshop=workshop,
            status=Booking.Status.ACTIVE
        ).count()

        if active_bookings >= workshop.capacity:
            raise serializers.ValidationError(
                'На мастер-классе нет свободных мест.'
            )

        return attrs