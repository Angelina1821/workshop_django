from django.db import models

class Classroom(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=300)

class Workshop(models.Model):
    title = models.CharField(max_length=200)
    descr = models.CharField(max_length=1000)
    date = models.DateTimeField()
    capacity = models.PositiveSmallIntegerField()
    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.PROTECT
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)