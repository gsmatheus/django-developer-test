from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import filters
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Control
from vehicle.models import Vehicle
from driver.models import Driver

from .serializers import ControlSerializer


class FetchData(APIView):
    filter_backends = [filters.SearchFilter]
    search_fields = ['departure_date', 'return_date']

    @swagger_auto_schema(
        operation_description="Fetch all controls",
        manual_parameters=[
            openapi.Parameter(
                name='page_size',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='Page size',
            ),
            openapi.Parameter(
                name='search',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description='Search query',
            ),
            openapi.Parameter(
                name='order_by',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description='Order by',
            ),
        ],
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'success': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Success'),
                    "total_items": openapi.Schema(type=openapi.TYPE_INTEGER, description='Total items'),
                    "total_pages": openapi.Schema(type=openapi.TYPE_INTEGER, description='Total pages'),
                    "current_page": openapi.Schema(type=openapi.TYPE_INTEGER, description='Current page'),
                    "results": openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Id'),
                                'departure_date': openapi.Schema(type=openapi.TYPE_STRING,
                                                                 description='Departure date'),
                                'departure_time': openapi.Schema(type=openapi.TYPE_STRING,
                                                                 description='Departure time'),
                                'departure_km': openapi.Schema(type=openapi.TYPE_INTEGER, description='Departure km'),
                                'destination': openapi.Schema(type=openapi.TYPE_STRING, description='Destination'),
                                'return_date': openapi.Schema(type=openapi.TYPE_STRING, description='Return date'),
                                'return_time': openapi.Schema(type=openapi.TYPE_STRING, description='Return time'),
                                'return_km': openapi.Schema(type=openapi.TYPE_INTEGER, description='Return km'),
                                'distance_traveled': openapi.Schema(type=openapi.TYPE_INTEGER,
                                                                    description='Distance traveled'),
                                'vehicle': openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                        'plate': openapi.Schema(type=openapi.TYPE_STRING),
                                        'brand': openapi.Schema(type=openapi.TYPE_STRING),
                                        'model': openapi.Schema(type=openapi.TYPE_STRING),
                                        'oil_change_km': openapi.Schema(type=openapi.TYPE_INTEGER),
                                        'created_at': openapi.Schema(type=openapi.TYPE_STRING),
                                        'updated_at': openapi.Schema(type=openapi.TYPE_STRING),
                                    }
                                ),
                                'driver': openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        'id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Driver ID'),
                                        'name': openapi.Schema(type=openapi.TYPE_STRING, description='Driver name'),
                                        'phone': openapi.Schema(type=openapi.TYPE_STRING,
                                                                description='Driver phone number'),
                                        'license_number': openapi.Schema(type=openapi.TYPE_STRING,
                                                                         description='Driver license number'),
                                    }
                                ),
                            }
                        )
                    )
                },
            )
        }
    )
    def get(self, request):
        paginator = PageNumberPagination()
        # controls = Control.objects.all()
        controls = Control.objects.select_related('vehicle', 'driver').all()

        paginator.page_size = request.GET.get('page_size', 10)

        search_query = request.GET.get('search', None)
        if search_query:
            controls = controls.filter(
                departure_date__icontains=search_query
            ) | controls.filter(
                return_date__icontains=search_query
            )

        order_by = request.GET.get('order_by', None)
        if order_by:
            controls = controls.order_by(order_by)

        result_page = paginator.paginate_queryset(controls, request)
        serializer = ControlSerializer(result_page, many=True)
        # return paginator.get_paginated_response(serializer.data)

        """Return a paginated list of controls."""
        return Response({
            "success": True,
            "total_items": paginator.page.paginator.count,
            "total_pages": paginator.page.paginator.num_pages,
            "current_page": paginator.page.number,
            # "next_page": paginator.get_next_link(),
            # "previous_page": paginator.get_previous_link(),
            "results": serializer.data,
        }, status=200)


class CreateControl(APIView):

    @swagger_auto_schema(
        operation_description="Create control",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'vehicle': openapi.Schema(type=openapi.TYPE_INTEGER, description='Vehicle id'),
                'driver': openapi.Schema(type=openapi.TYPE_INTEGER, description='Driver id'),
                'departure_date': openapi.Schema(type=openapi.TYPE_STRING, description='Departure date'),
                'departure_time': openapi.Schema(type=openapi.TYPE_STRING, description='Departure time'),
                'departure_km': openapi.Schema(type=openapi.TYPE_INTEGER, description='Departure km'),
                'destination': openapi.Schema(type=openapi.TYPE_STRING, description='Destination'),
                'return_date': openapi.Schema(type=openapi.TYPE_STRING, description='Return date'),
                'return_time': openapi.Schema(type=openapi.TYPE_STRING, description='Return time'),
                'return_km': openapi.Schema(type=openapi.TYPE_INTEGER, description='Return km'),
            }
        ),
        responses={
            201: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'control': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Id'),
                            'departure_date': openapi.Schema(type=openapi.TYPE_STRING, description='Departure date'),
                            'departure_time': openapi.Schema(type=openapi.TYPE_STRING, description='Departure time'),
                            'departure_km': openapi.Schema(type=openapi.TYPE_INTEGER, description='Departure km'),
                            'destination': openapi.Schema(type=openapi.TYPE_STRING, description='Destination'),
                            'return_date': openapi.Schema(type=openapi.TYPE_STRING, description='Return date'),
                            'return_time': openapi.Schema(type=openapi.TYPE_STRING, description='Return time'),
                            'return_km': openapi.Schema(type=openapi.TYPE_INTEGER, description='Return km'),
                            'distance_traveled': openapi.Schema(type=openapi.TYPE_INTEGER,
                                                                description='Distance traveled'),
                            'vehicle': openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                    'plate': openapi.Schema(type=openapi.TYPE_STRING),
                                    'brand': openapi.Schema(type=openapi.TYPE_STRING),
                                    'model': openapi.Schema(type=openapi.TYPE_STRING),
                                    'oil_change_km': openapi.Schema(type=openapi.TYPE_INTEGER),
                                    'created_at': openapi.Schema(type=openapi.TYPE_STRING),
                                    'updated_at': openapi.Schema(type=openapi.TYPE_STRING),
                                }
                            ),
                            'driver': openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Driver ID'),
                                    'name': openapi.Schema(type=openapi.TYPE_STRING, description='Driver name'),
                                    'phone': openapi.Schema(type=openapi.TYPE_STRING,
                                                            description='Driver phone number'),
                                    'license_number': openapi.Schema(type=openapi.TYPE_STRING,
                                                                     description='Driver license number'),
                                }
                            ),
                        }
                    )
                },
            ),
            400: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error message'),
                },
            ),
        }
    )
    def post(self, request):
        required_fields = ['vehicle', 'driver', 'departure_date', 'departure_time', 'departure_km', 'destination',
                           'return_date', 'return_time', 'return_km']

        if not all([field in request.data for field in required_fields]):
            return Response({"error": "Missing required fields"}, status=400)

        # Check if vehicle exists
        vehicle = Vehicle.objects.filter(id=request.data["vehicle"]).first()
        if not vehicle:
            return Response({"error": "Vehicle not found"}, status=404)

        # Check if driver exists
        driver = Driver.objects.filter(id=request.data["driver"]).first()
        if not driver:
            return Response({"error": "Driver not found"}, status=404)

        control = Control.objects.create(
            vehicle=vehicle,
            driver=driver,
            departure_date=request.data["departure_date"],
            departure_time=request.data["departure_time"],
            departure_km=request.data["departure_km"],
            destination=request.data["destination"],
            return_date=request.data["return_date"],
            return_time=request.data["return_time"],
            return_km=request.data["return_km"]
        )

        serializer = ControlSerializer(control)
        return Response({"control": serializer.data}, status=201)


class UpdateControl(APIView):

    @swagger_auto_schema(
        operation_description="Update control",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'vehicle': openapi.Schema(type=openapi.TYPE_INTEGER, description='Vehicle id'),
                'driver': openapi.Schema(type=openapi.TYPE_INTEGER, description='Driver id'),
                'departure_date': openapi.Schema(type=openapi.TYPE_STRING, description='Departure date'),
                'departure_time': openapi.Schema(type=openapi.TYPE_STRING, description='Departure time'),
                'departure_km': openapi.Schema(type=openapi.TYPE_INTEGER, description='Departure km'),
                'destination': openapi.Schema(type=openapi.TYPE_STRING, description='Destination'),
                'return_date': openapi.Schema(type=openapi.TYPE_STRING, description='Return date'),
                'return_time': openapi.Schema(type=openapi.TYPE_STRING, description='Return time'),
                'return_km': openapi.Schema(type=openapi.TYPE_INTEGER, description='Return km'),
            }
        ),
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'success': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Success'),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description='Message'),
                },
            ),
            400: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error message'),
                },
            ),
        }
    )
    def put(self, request, control_id):
        control = Control.objects.filter(id=control_id).first()

        if not control:
            return Response({"error": "Control not found"}, status=404)

        # Check if vehicle exists in request.data
        if "vehicle" in request.data:
            # Check if vehicle exists
            vehicle = Vehicle.objects.filter(id=request.data["vehicle"]).first()
            if not vehicle:
                return Response({"error": "Vehicle not found"}, status=404)
            control.vehicle = vehicle

        # Check if driver exists in request.data
        if "driver" in request.data:
            # Check if driver exists
            driver = Driver.objects.filter(id=request.data["driver"]).first()
            if not driver:
                return Response({"error": "Driver not found"}, status=404)
            control.driver = driver

        control.departure_date = request.data.get("departure_date", control.departure_date)
        control.departure_time = request.data.get("departure_time", control.departure_time)
        control.departure_km = request.data.get("departure_km", control.departure_km)
        control.destination = request.data.get("destination", control.destination)
        control.return_date = request.data.get("return_date", control.return_date)
        control.return_time = request.data.get("return_time", control.return_time)
        control.return_km = request.data.get("return_km", control.return_km)
        control.save()

        return Response({
            "success": True,
            "message": "Control updated successfully",
        }, status=200)


class DeleteControl(APIView):

    @swagger_auto_schema(
        operation_description="Delete control",
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'success': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Success'),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description='Message'),
                },
            ),
            404: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error message'),
                },
            ),
        }
    )
    def delete(self, request, control_id):
        control = Control.objects.filter(id=control_id).first()

        if not control:
            return Response({"error": "Control not found"}, status=404)

        control.delete()

        return Response({
            "success": True,
            "message": "Control deleted successfully",
        }, status=200)


class FindById(APIView):

    @swagger_auto_schema(
        operation_description="Find control by id",
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'success': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Success'),
                    'control': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Id'),
                            'departure_date': openapi.Schema(type=openapi.TYPE_STRING, description='Departure date'),
                            'departure_time': openapi.Schema(type=openapi.TYPE_STRING, description='Departure time'),
                            'departure_km': openapi.Schema(type=openapi.TYPE_INTEGER, description='Departure km'),
                            'destination': openapi.Schema(type=openapi.TYPE_STRING, description='Destination'),
                            'return_date': openapi.Schema(type=openapi.TYPE_STRING, description='Return date'),
                            'return_time': openapi.Schema(type=openapi.TYPE_STRING, description='Return time'),
                            'return_km': openapi.Schema(type=openapi.TYPE_INTEGER, description='Return km'),
                            'distance_traveled': openapi.Schema(type=openapi.TYPE_INTEGER,
                                                                description='Distance traveled'),
                            'vehicle': openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                    'plate': openapi.Schema(type=openapi.TYPE_STRING),
                                    'brand': openapi.Schema(type=openapi.TYPE_STRING),
                                    'model': openapi.Schema(type=openapi.TYPE_STRING),
                                    'oil_change_km': openapi.Schema(type=openapi.TYPE_INTEGER),
                                    'created_at': openapi.Schema(type=openapi.TYPE_STRING),
                                    'updated_at': openapi.Schema(type=openapi.TYPE_STRING),
                                }
                            ),
                            'driver': openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Driver ID'),
                                    'name': openapi.Schema(type=openapi.TYPE_STRING, description='Driver name'),
                                    'phone': openapi.Schema(type=openapi.TYPE_STRING,
                                                            description='Driver phone number'),
                                    'license_number': openapi.Schema(type=openapi.TYPE_STRING,
                                                                     description='Driver license number'),
                                }
                            ),
                        }
                    ),
                },
            ),
            404: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error message'),
                },
            ),
        }
    )
    def get(self, request, control_id):
        control = Control.objects.filter(id=control_id).first()

        if not control:
            return Response({"error": "Control not found"}, status=404)

        serializer = ControlSerializer(control)

        return Response({
            "success": True,
            "control": serializer.data,
        }, status=200)


class TotalKm(APIView):

    @swagger_auto_schema(
        operation_description="Get total km",
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'success': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Success'),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, description='Message'),
                    'oil_change_km': openapi.Schema(type=openapi.TYPE_INTEGER, description='Oil change km'),
                    'km_left': openapi.Schema(type=openapi.TYPE_INTEGER, description='Km left'),
                    'total_km': openapi.Schema(type=openapi.TYPE_INTEGER, description='Total km'),
                },
            ),
            404: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error message'),
                },
            ),
        }
    )
    def get(self, request, vehicle_id):
        vehicle = Vehicle.objects.filter(id=vehicle_id).first()

        if not vehicle:
            return Response({"error": "Vehicle not found"}, status=404)

        controls = Control.objects.filter(vehicle=vehicle_id)

        km_total = 0
        for control in controls:
            km_total += control.distance_traveled

        km_left = vehicle.oil_change_km - km_total

        if km_total >= vehicle.oil_change_km:
            return Response({
                "success": True,
                "message": "Vehicle exceeded the km limit",
                "oil_change_km": vehicle.oil_change_km,
                "km_left": km_left,
                "total_km": km_total
            }, status=200)

        return Response({
            "success": True,
            "message": "Vehicle is within the km limit",
            "km_left": km_left,
            "total_km": km_total
        }, status=200)
