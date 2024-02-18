from django.test import TestCase
from rest_framework.test import APIClient
from .models import Control


class ControlTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.data = {
            "driver": 0,
            "vehicle": 0,

            "departure_date": "2023-08-11",
            "departure_time": "10:30:00.000000",

            "return_date": "2023-08-11",
            "return_time": "12:30:00.000000",

            "departure_km": 150,
            "return_km": 250,
            "destination": "São Paulo",
        }
        self.data_driver = {
            'name': 'Matheus',
            'phone': '14 99655-5555',
            'license_number': 'ABC123',
        }
        self.data_vehicle = {
            'plate': 'ABC-1234',
            'model': 'Fusca',
            'brand': 'Volkswagen',
            "oil_change_km": 1000,
        }

    def test_control_created(self):
        created_driver = self.client.post('/api/driver/create', self.data_driver, format='json')
        created_vehicle = self.client.post('/api/vehicle/create', self.data_vehicle, format='json')

        self.data["driver"] = created_driver.data["driver"]["id"]
        self.data["vehicle"] = created_vehicle.data["vehicle"]["id"]

        response = self.client.post('/api/control/create', self.data, format='json')
        self.assertEqual(response.status_code, 201)

    def test_control_updated(self):
        created_driver = self.client.post('/api/driver/create', self.data_driver, format='json')
        created_vehicle = self.client.post('/api/vehicle/create', self.data_vehicle, format='json')

        self.data["driver"] = created_driver.data["driver"]["id"]
        self.data["vehicle"] = created_vehicle.data["vehicle"]["id"]

        created_control = self.client.post('/api/control/create', self.data, format='json')

        self.data["departure_km"] = 200
        self.data["return_km"] = 300

        response = self.client.put(
            f'/api/control/{created_control.data["control"]["id"]}/update',
            self.data,
            format='json'
        )

        find_control = self.client.get(
            f'/api/control/{created_control.data["control"]["id"]}',
            format='json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(find_control.data["control"]["departure_km"], self.data["departure_km"])
        self.assertEqual(find_control.data["control"]["return_km"], self.data["return_km"])

    def test_control_deleted(self):
        created_driver = self.client.post('/api/driver/create', self.data_driver, format='json')
        created_vehicle = self.client.post('/api/vehicle/create', self.data_vehicle, format='json')

        self.data["driver"] = created_driver.data["driver"]["id"]
        self.data["vehicle"] = created_vehicle.data["vehicle"]["id"]

        created_control = self.client.post('/api/control/create', self.data, format='json')

        response = self.client.delete(
            f'/api/control/{created_control.data["control"]["id"]}/delete',
            format='json'
        )
        self.assertEqual(response.status_code, 200)

    def test_control_total_km(self):
        created_driver = self.client.post('/api/driver/create', self.data_driver, format='json')
        created_vehicle = self.client.post('/api/vehicle/create', self.data_vehicle, format='json')

        self.data["driver"] = created_driver.data["driver"]["id"]
        self.data["vehicle"] = created_vehicle.data["vehicle"]["id"]

        created_control = self.client.post('/api/control/create', self.data, format='json')

        response = self.client.get(
            f'/api/control/{created_control.data["control"]["vehicle"]["id"]}/total_km',
            format='json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_km"], 100)

    def test_control_find_control(self):
        created_driver = self.client.post('/api/driver/create', self.data_driver, format='json')
        created_vehicle = self.client.post('/api/vehicle/create', self.data_vehicle, format='json')

        self.data["driver"] = created_driver.data["driver"]["id"]
        self.data["vehicle"] = created_vehicle.data["vehicle"]["id"]

        created_control = self.client.post('/api/control/create', self.data, format='json')

        response = self.client.get(
            f'/api/control/{created_control.data["control"]["id"]}',
            format='json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["control"]["departure_km"], self.data["departure_km"])
        self.assertEqual(response.data["control"]["return_km"], self.data["return_km"])

    def test_control_find_control_with_invalid_id(self):
        response = self.client.get(
            f'/api/control/999',
            format='json'
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "Control not found")

    def test_control_create_with_invalid_driver(self):
        created_vehicle = self.client.post('/api/vehicle/create', self.data_vehicle, format='json')

        self.data["vehicle"] = created_vehicle.data["vehicle"]["id"]
        self.data["driver"] = 999

        response = self.client.post('/api/control/create', self.data, format='json')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "Driver not found")

    def test_control_create_with_invalid_vehicle(self):
        created_driver = self.client.post('/api/driver/create', self.data_driver, format='json')

        self.data["driver"] = created_driver.data["driver"]["id"]
        self.data["vehicle"] = 999

        response = self.client.post('/api/control/create', self.data, format='json')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "Vehicle not found")
