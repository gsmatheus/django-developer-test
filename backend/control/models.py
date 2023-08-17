from django.db import models
from driver.models import Driver
from vehicle.models import Vehicle


class Control(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    departure_date = models.DateField()
    departure_time = models.TimeField()
    departure_km = models.PositiveIntegerField()
    destination = models.CharField(max_length=200)
    return_date = models.DateField(null=True, blank=True)
    return_time = models.TimeField(null=True, blank=True)
    return_km = models.PositiveIntegerField(null=True, blank=True)
    distance_traveled = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-departure_date']
        db_table = 'control'

    def save(self, *args, **kwargs):
        if self.return_km:
            self.distance_traveled = int(self.return_km) - int(self.departure_km)

        super(Control, self).save(*args, **kwargs)
