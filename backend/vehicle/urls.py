from django.urls import path

from .views import FetchData, CreateVehicle, UpdateVehicle, DeleteVehicle, FetchAllVehicles

urlpatterns = [
    path('vehicle', FetchData.as_view(), name='fetch_data'),
    path('vehicle/create', CreateVehicle.as_view(), name='create_vehicle'),
    path('vehicle/<int:vehicle_id>/update', UpdateVehicle.as_view(), name='update_vehicle'),
    path('vehicle/<int:vehicle_id>/delete', DeleteVehicle.as_view(), name='delete_vehicle'),
    path('vehicle/all', FetchAllVehicles.as_view(), name='fetch_all_vehicles'),
]
