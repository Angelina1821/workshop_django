from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import Booking
from workshops.models import Workshop

@transaction.atomic
def create_booking(*, user, workshop):
    # Блокируем мастер-класс на время создания бронирования.
    workshop = Workshop.objects.select_for_update().get(
        pk=workshop.pk
    )

    # Проверяем, что мастер-класс ещё не прошёл.
    if workshop.date <= timezone.now():
        raise ValidationError(
            'Нельзя записаться на прошедший мастер-класс.'
        )

    # Проверяем, нет ли уже активной записи пользователя.
    existing_booking = Booking.objects.filter(
        user=user,
        workshop=workshop,
        status=Booking.Status.ACTIVE
    ).exists()

    if existing_booking:
        raise ValidationError(
            'Вы уже записаны на этот мастер-класс.'
        )

    # Проверяем количество свободных мест.
    active_bookings = Booking.objects.filter(
        workshop=workshop,
        status=Booking.Status.ACTIVE
    ).count()

    if active_bookings >= workshop.capacity:
        raise ValidationError(
            'На мастер-классе нет свободных мест.'
        )

    return Booking.objects.create(
        user=user,
        workshop=workshop
    )