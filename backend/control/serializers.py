from rest_framework import serializers
from .models import Control

from driver.serializers import DriverSerializer
from vehicle.serializers import VehicleSerializer


class ControlSerializer(serializers.ModelSerializer):
    driver = DriverSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)

    class Meta:
        model = Control
        fields = '__all__'
