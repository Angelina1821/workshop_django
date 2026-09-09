from rest_framework import serializers

from .models import Booking
from workshops.serializers import WorkshopSerializer

class BookingSerializer(serializers.ModelSerializer):
    #добавление инфы о мастер-классе в бронирновании
    workshop_details = WorkshopSerializer(
        source='workshop',
        read_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id',
            'user',
            'workshop',
            'workshop_details',
            'status',
            'created_at',
        ]
        read_only_fields = [
            'user',
            'status',
            'created_at',
        ]
