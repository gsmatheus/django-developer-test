from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import filters
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Driver
from .serializers import DriverSerializer


class FetchData(APIView):
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'phone', 'license_number']

    @swagger_auto_schema(
        operation_description="Get list of drivers",
        manual_parameters=[
            openapi.Parameter(
                name='search',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description='Search by name, phone or license number',
                required=False
            ),
            openapi.Parameter(
                name='page_size',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER,
                description='Number of items per page',
                required=False
            ),
        ],
        responses={
            200: openapi.Response(
                description="List of drivers",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(
                            type=openapi.TYPE_BOOLEAN,
                            description='True if request is successful'
                        ),
                        'total_items': openapi.Schema(
                            type=openapi.TYPE_INTEGER,
                            description='Total number of items'
                        ),
                        'total_pages': openapi.Schema(
                            type=openapi.TYPE_INTEGER,
                            description='Total number of pages'
                        ),
                        'current_page': openapi.Schema(
                            type=openapi.TYPE_INTEGER,
                            description='Current page number'
                        ),
                        'results': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id': openapi.Schema(
                                        type=openapi.TYPE_INTEGER,
                                        description='Driver ID'
                                    ),
                                    'name': openapi.Schema(
                                        type=openapi.TYPE_STRING,
                                        description='Driver name'
                                    ),
                                    'phone': openapi.Schema(
                                        type=openapi.TYPE_STRING,
                                        description='Driver phone number'
                                    ),
                                    'license_number': openapi.Schema(
                                        type=openapi.TYPE_STRING,
                                        description='Driver license number'
                                    ),
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
        drivers = Driver.objects.all()

        paginator.page_size = request.GET.get('page_size', 10)
        search_query = request.GET.get('search', None)

        if search_query:
            drivers = drivers.filter(
                name__icontains=search_query
            ) | drivers.filter(
                phone__icontains=search_query
            ) | drivers.filter(
                license_number__icontains=search_query
            )

        result_page = paginator.paginate_queryset(drivers, request)
        serializer = DriverSerializer(result_page, many=True)

        return Response({
            "success": True,
            "total_items": paginator.page.paginator.count,
            "total_pages": paginator.page.paginator.num_pages,
            "current_page": paginator.page.number,
            "results": serializer.data,
        }, status=200)


class CreateDriver(APIView):

    @swagger_auto_schema(
        operation_description="Create a new driver",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Driver name'
                ),
                'phone': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Driver phone number'
                ),
                'license_number': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Driver license number'
                ),
            }
        ),
        responses={
            201: openapi.Response(
                description="Driver created successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'driver': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(
                                    type=openapi.TYPE_INTEGER,
                                    description='Driver ID'
                                ),
                                'name': openapi.Schema(
                                    type=openapi.TYPE_STRING,
                                    description='Driver name'
                                ),
                                'phone': openapi.Schema(
                                    type=openapi.TYPE_STRING,
                                    description='Driver phone number'
                                ),
                                'license_number': openapi.Schema(
                                    type=openapi.TYPE_STRING,
                                    description='Driver license number'
                                ),
                            }
                        )
                    }
                )
            ),
            400: openapi.Response(
                description="Missing required fields",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Error message'
                        ),
                    }
                )
            )
        }
    )
    def post(self, request):
        required_fields = ['name', 'phone', 'license_number']

        if not all([field in request.data for field in required_fields]):
            return Response({"error": "Missing required fields"}, status=400)

        driver = Driver.objects.create(
            name=request.data["name"],
            phone=request.data["phone"],
            license_number=request.data["license_number"]
        )

        serializer = DriverSerializer(driver)
        return Response({"driver": serializer.data}, status=201)


class UpdateDriver(APIView):

    @swagger_auto_schema(
        operation_description="Update driver details",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Driver name'
                ),
                'phone': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Driver phone number'
                ),
                'license_number': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Driver license number'
                ),
            }
        ),
        responses={
            200: openapi.Response(
                description="Driver updated successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(
                            type=openapi.TYPE_BOOLEAN,
                            description='True if request is successful'
                        ),
                        'message': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Success message'
                        ),
                    }
                )
            ),
            400: openapi.Response(
                description="Missing required fields",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Error message'
                        ),
                    }
                )
            ),
            404: openapi.Response(
                description="Driver not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Error message'
                        ),
                    }
                )
            )
        }
    )
    def put(self, request, driver_id):
        driver = Driver.objects.filter(id=driver_id).first()

        if not driver:
            return Response({"error": "Driver not found"}, status=404)

        driver.name = request.data.get("name", driver.name)
        driver.phone = request.data.get("phone", driver.phone)
        driver.license_number = request.data.get("license_number", driver.license_number)
        driver.save()

        return Response({
            "success": True,
            "message": "Driver updated successfully",
        }, status=200)


class DeleteDriver(APIView):

    @swagger_auto_schema(
        operation_description="Delete a driver",
        responses={
            200: openapi.Response(
                description="Driver deleted successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(
                            type=openapi.TYPE_BOOLEAN,
                            description='True if request is successful'
                        ),
                        'message': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Success message'
                        ),
                    }
                )
            ),
            404: openapi.Response(
                description="Driver not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Error message'
                        ),
                    }
                )
            )
        }
    )
    def delete(self, request, driver_id):
        driver = Driver.objects.filter(id=driver_id).first()

        if not driver:
            return Response({"error": "Driver not found"}, status=404)

        driver.delete()

        return Response({
            "success": True,
            "message": "Driver deleted successfully",
        }, status=200)


class FetchAllDrivers(APIView):

    @swagger_auto_schema(
        operation_description="Get list of all drivers",
        responses={
            200: openapi.Response(
                description="List of drivers",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(
                            type=openapi.TYPE_BOOLEAN,
                            description='True if request is successful'
                        ),
                        'results': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id': openapi.Schema(
                                        type=openapi.TYPE_INTEGER,
                                        description='Driver ID'
                                    ),
                                    'name': openapi.Schema(
                                        type=openapi.TYPE_STRING,
                                        description='Driver name'
                                    ),
                                    'phone': openapi.Schema(
                                        type=openapi.TYPE_STRING,
                                        description='Driver phone number'
                                    ),
                                    'license_number': openapi.Schema(
                                        type=openapi.TYPE_STRING,
                                        description='Driver license number'
                                    ),
                                }
                            )
                        )
                    }
                )
            )
        }
    )
    def get(self, request):
        drivers = Driver.objects.all()
        serializer = DriverSerializer(drivers, many=True)

        return Response({
            "success": True,
            "results": serializer.data,
        }, status=200)
