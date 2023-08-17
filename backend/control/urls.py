from django.urls import path

from .views import FetchData, CreateControl, UpdateControl, DeleteControl, FindById, TotalKm

urlpatterns = [
    path('control', FetchData.as_view(), name='fetch_data'),
    path('control/create', CreateControl.as_view(), name='create_control'),
    path('control/<int:control_id>/update', UpdateControl.as_view(), name='update_control'),
    path('control/<int:control_id>/delete', DeleteControl.as_view(), name='delete_control'),
    path('control/<int:control_id>', FindById.as_view(), name='find_control'),
    path('control/<int:vehicle_id>/total_km', TotalKm.as_view(), name='total_km'),
]
