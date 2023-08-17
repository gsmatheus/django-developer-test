from django.db import models


class Vehicle(models.Model):
    plate = models.CharField(max_length=10)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    oil_change_km = models.IntegerField()

    class Meta:
        db_table = 'vehicle'
