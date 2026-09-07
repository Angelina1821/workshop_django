from django.db import models


class Booking(models.Model):

    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Активна'
        CANCELLED = 'CANCELLED', 'Отменена'

    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE
    )
    workshop = models.ForeignKey(
        'workshops.Workshop',
        on_delete=models.CASCADE
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'workshop'],
                condition=models.Q(status='ACTIVE'),
                name='unique_active_booking'
            )
        ]