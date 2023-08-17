from django.test import TestCase
from rest_framework.test import APIClient


class VehicleTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.data = {
            'plate': 'ABC123',
            'brand': 'Toyota',
            'model': 'Camry',
            'oil_change_km': 10000,
        }

    def test_vehicle_created(self):
        response = self.client.post('/api/vehicle/create', self.data, format='json')

        self.assertEqual(response.status_code, 201)

    def test_vehicle_updated(self):
        created_vehicle = self.client.post('/api/vehicle/create', self.data, format='json')

        response = self.client.put(
            f'/api/vehicle/{created_vehicle.data["vehicle"]["id"]}/update',
            self.data,
            format='json'
        )
        self.assertEqual(response.status_code, 200)

    def test_vehicle_deleted(self):
        created_vehicle = self.client.post('/api/vehicle/create', self.data, format='json')

        response = self.client.delete(
            f'/api/vehicle/{created_vehicle.data["vehicle"]["id"]}/delete',
            format='json'
        )
        self.assertEqual(response.status_code, 200)

    def test_create_vehicle_with_missing_fields(self):
        response = self.client.post('/api/vehicle/create', {}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'Missing required fields')

    def test_update_vehicle_with_invalid_id(self):
        response = self.client.put('/api/vehicle/1/update', self.data, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], 'Vehicle not found')

    def test_delete_vehicle_with_invalid_id(self):
        response = self.client.delete('/api/vehicle/1/delete', format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], 'Vehicle not found')
