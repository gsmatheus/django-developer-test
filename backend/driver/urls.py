from django.urls import path

from .views import FetchData, CreateDriver, UpdateDriver, DeleteDriver, FetchAllDrivers

urlpatterns = [
    path('driver', FetchData.as_view(), name='fetch_data'),
    path('driver/create', CreateDriver.as_view(), name='create_driver'),
    path('driver/<int:driver_id>/update', UpdateDriver.as_view(), name='update_driver'),
    path('driver/<int:driver_id>/delete', DeleteDriver.as_view(), name='delete_driver'),
    path('driver/all', FetchAllDrivers.as_view(), name='fetch_all_drivers'),
]
