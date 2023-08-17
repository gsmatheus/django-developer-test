from django.db import models


class Driver(models.Model):
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=16)
    license_number = models.CharField(max_length=20)

    class Meta:
        db_table = 'driver'
