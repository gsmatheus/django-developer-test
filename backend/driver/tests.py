from django.test import TestCase
from rest_framework.test import APIClient


class DriverTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.data = {
            'name': 'Matheus',
            'phone': '14 99655-5555',
            'license_number': 'ABC123',
        }

    def test_driver_created(self):
        response = self.client.post('/api/driver/create', self.data, format='json')

        self.assertEqual(response.status_code, 201)

    def test_driver_updated(self):
        created_driver = self.client.post('/api/driver/create', self.data, format='json')

        response = self.client.put(
            f'/api/driver/{created_driver.data["driver"]["id"]}/update',
            self.data,
            format='json'
        )
        self.assertEqual(response.status_code, 200)

    def test_driver_deleted(self):
        created_driver = self.client.post('/api/driver/create', self.data, format='json')

        response = self.client.delete(
            f'/api/driver/{created_driver.data["driver"]["id"]}/delete',
            format='json'
        )
        self.assertEqual(response.status_code, 200)

    def test_create_driver_with_missing_fields(self):
        response = self.client.post('/api/driver/create', {}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'Missing required fields')

    def test_update_driver_with_invalid_id(self):
        response = self.client.put('/api/driver/999/update', self.data, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], 'Driver not found')

    def test_delete_driver_with_invalid_id(self):
        response = self.client.delete('/api/driver/999/delete', format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], 'Driver not found')
