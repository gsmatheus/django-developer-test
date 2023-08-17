from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import filters
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Vehicle
from .serializers import VehicleSerializer


class FetchData(APIView):
    filter_backends = [filters.SearchFilter]
    search_fields = ['plate', 'brand', 'model']

    @swagger_auto_schema(
        operation_description="Fetch all vehicles",
        responses={
            200: openapi.Response(
                description="Success",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'total_items': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'total_pages': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'current_page': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'results': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
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
                            )
                        )
                    }
                )
            )
        }
    )
    def get(self, request):
        paginator = PageNumberPagination()
        vehicles = Vehicle.objects.all()

        paginator.page_size = request.GET.get('page_size', 10)
        search_query = request.GET.get('search', None)

        if search_query:
            vehicles = vehicles.filter(
                plate__icontains=search_query
            ) | vehicles.filter(
                brand__icontains=search_query
            ) | vehicles.filter(
                model__icontains=search_query
            )

        result_page = paginator.paginate_queryset(vehicles, request)
        serializer = VehicleSerializer(result_page, many=True)

        return Response({
            "success": True,
            "total_items": paginator.page.paginator.count,
            "total_pages": paginator.page.paginator.num_pages,
            "current_page": paginator.page.number,
            "results": serializer.data,
        }, status=200)


class CreateVehicle(APIView):

    @swagger_auto_schema(
        operation_description="Create a new vehicle",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['plate', 'brand', 'model', 'oil_change_km'],
            properties={
                'plate': openapi.Schema(type=openapi.TYPE_STRING),
                'brand': openapi.Schema(type=openapi.TYPE_STRING),
                'model': openapi.Schema(type=openapi.TYPE_STRING),
                'oil_change_km': openapi.Schema(type=openapi.TYPE_INTEGER),
            }
        ),
        responses={
            201: openapi.Response(
                description="Success",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
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
                        )
                    }
                )
            ),
            400: openapi.Response(
                description="Bad Request",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            )
        }
    )
    def post(self, request):
        required_fields = ['plate', 'brand', 'model', 'oil_change_km']

        if not all([field in request.data for field in required_fields]):
            return Response({"error": "Missing required fields"}, status=400)

        vehicle = Vehicle.objects.create(
            plate=request.data["plate"],
            brand=request.data["brand"],
            model=request.data["model"],
            oil_change_km=request.data["oil_change_km"]
        )

        serializer = VehicleSerializer(vehicle)
        return Response({"vehicle": serializer.data}, status=201)


class UpdateVehicle(APIView):

    @swagger_auto_schema(
        operation_description="Update a vehicle",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'plate': openapi.Schema(type=openapi.TYPE_STRING),
                'brand': openapi.Schema(type=openapi.TYPE_STRING),
                'model': openapi.Schema(type=openapi.TYPE_STRING),
                'oil_change_km': openapi.Schema(type=openapi.TYPE_INTEGER),
            }
        ),
        responses={
            200: openapi.Response(
                description="Success",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'message': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            ),
            404: openapi.Response(
                description="Not Found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            )
        }
    )
    def put(self, request, vehicle_id):
        try:
            vehicle = Vehicle.objects.get(pk=vehicle_id)
        except Vehicle.DoesNotExist:
            return Response({"error": "Vehicle not found"}, status=404)

        # TODO: Add validation for required fields
        vehicle.plate = request.data.get("plate", vehicle.plate)
        vehicle.brand = request.data.get("brand", vehicle.brand)
        vehicle.model = request.data.get("model", vehicle.model)
        vehicle.oil_change_km = request.data.get("oil_change_km", vehicle.oil_change_km)

        vehicle.save()

        return Response({
            "success": True,
            "message": "Vehicle updated successfully",
        })


class DeleteVehicle(APIView):

    @swagger_auto_schema(
        operation_description="Delete a vehicle",
        responses={
            200: openapi.Response(
                description="Success",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'message': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            ),
            404: openapi.Response(
                description="Not Found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            )
        }
    )
    def delete(self, request, vehicle_id):
        try:
            vehicle = Vehicle.objects.get(pk=vehicle_id)
        except Vehicle.DoesNotExist:
            return Response({"error": "Vehicle not found"}, status=404)

        vehicle.delete()

        return Response({
            "success": True,
            "message": "Vehicle deleted successfully",
        })


class FetchAllVehicles(APIView):

    @swagger_auto_schema(
        operation_description="Fetch all vehicles",
        responses={
            200: openapi.Response(
                description="Success",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'results': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                    'plate': openapi.Schema(type=openapi.TYPE_STRING),
                                    'brand': openapi.Schema(type=openapi.TYPE_STRING),
                                    'model': openapi.Schema(type=openapi.TYPE_STRING),
                                    'oil_change_km': openapi.Schema(type=openapi.TYPE_INTEGER),
                                }
                            )
                        )
                    }
                )
            )
        }
    )
    def get(self, request):
        vehicles = Vehicle.objects.all()
        serializer = VehicleSerializer(vehicles, many=True)

        return Response({
            "success": True,
            "results": serializer.data,
        }, status=200)
