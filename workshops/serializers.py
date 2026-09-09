from rest_framework import serializers

from .models import Workshop, Classroom

class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = [
            'id',
            'name',
            'address',
        ]

class WorkshopSerializer(serializers.ModelSerializer):
    classroom_details = ClassroomSerializer(
        source='classroom',
        read_only=True
    )
    class Meta:
        model = Workshop
        fields = [
            'id',
            'title',
            'descr',
            'date',
            'capacity',
            'classroom',
            'classroom_details',
            'created_at',
            'updated_at',
        ]