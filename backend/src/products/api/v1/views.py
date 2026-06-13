# products/views.py
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from ...models import Category, CarBrand, CarModel, ProductBrand, Product, ProductComment
from .serializers import (
    CategorySerializer, CarBrandSerializer, CarModelSerializer,
    ProductBrandSerializer, ProductSerializer, ProductCommentSerializer, ProductCommentCreateSerializer
)
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache

# Category views
@method_decorator(cache_page(60 * 10), name='dispatch')   # 10 minutes
class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['parent']
    search_fields = ['name', 'description']


class CategoryRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


# CarBrand views 
@method_decorator(cache_page(60 * 10), name='dispatch')   # 10 minutes
class CarBrandListAPIView(generics.ListAPIView):
    queryset = CarBrand.objects.all()
    serializer_class = CarBrandSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class CarBrandRetrieveAPIView(generics.RetrieveAPIView):
    queryset = CarBrand.objects.all()
    serializer_class = CarBrandSerializer
    lookup_field = 'slug'


# CarModel views 
class CarModelListAPIView(generics.ListAPIView):
    queryset = CarModel.objects.all()
    serializer_class = CarModelSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['brand']
    search_fields = ['name']


class CarModelRetrieveAPIView(generics.RetrieveAPIView):
    queryset = CarModel.objects.all()
    serializer_class = CarModelSerializer
    lookup_field = 'slug'


# ProductBrand views 
@method_decorator(cache_page(60 * 10), name='dispatch')   # 10 minutes
class ProductBrandListAPIView(generics.ListAPIView):
    queryset = ProductBrand.objects.all()
    serializer_class = ProductBrandSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class ProductBrandRetrieveAPIView(generics.RetrieveAPIView):
    queryset = ProductBrand.objects.all()
    serializer_class = ProductBrandSerializer
    lookup_field = 'slug'


# Product views
@method_decorator(cache_page(60 * 5), name='dispatch')   # 5 minutes 
class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.filter(is_available=True).select_related('category', 'brand').prefetch_related('compatible_cars')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'is_hotsale', 'is_available', 'compatible_cars', 'compatible_cars__brand']
    search_fields = ['name', 'description', 'specifications']
    ordering_fields = ['price', 'discount_price', 'created_date', 'name', 'stock']
    ordering = ['-created_date']


class ProductRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_available=True).select_related('category', 'brand').prefetch_related('compatible_cars')
    serializer_class = ProductSerializer
    lookup_field = 'slug'


class ProductCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductCommentSerializer

    def get_queryset(self):
        """
        Dynamically filters comments based on the product_id passed in the URL.
        Only returns approved comments.
        """
        product_id = self.kwargs.get('product_id')
        return ProductComment.objects.filter(product_id=product_id, is_approved=True).select_related('user')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductCommentCreateSerializer
        return ProductCommentSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_approved=False)


class HomepageDataAPIView(APIView):
    def get(self, request):
        cache_key = 'homepage_data'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        # Fetch main categories (parent is null)
        categories = Category.objects.filter(parent__isnull=True)
        
        # Fetch car brands
        car_brands = CarBrand.objects.all()
        
        # Fetch product brands
        product_brands = ProductBrand.objects.all()
        
        # Fetch hot‑sale products with context
        hot_sale_products = Product.objects.filter(is_hotsale=True, is_available=True)\
            .select_related('category', 'brand')\
            .prefetch_related('compatible_cars', 'images')
        hot_sale_serializer = ProductSerializer(hot_sale_products, many=True, context={'request': request})
        
        # Fetch products for each main category with context
        products_by_category = {}
        for cat in categories:
            products = Product.objects.filter(category=cat, is_available=True)\
                .select_related('category', 'brand')\
                .prefetch_related('compatible_cars', 'images')[:20] 
            products_by_category[cat.id] = ProductSerializer(products, many=True, context={'request': request}).data
        
        data = {
            'categories': CategorySerializer(categories, many=True).data,
            'carBrands': CarBrandSerializer(car_brands, many=True).data,
            'productBrands': ProductBrandSerializer(product_brands, many=True).data,
            'hotSaleProducts': hot_sale_serializer.data,
            'productsByCategory': products_by_category,
        }
        
        # Cache for 10 minutes
        cache.set(cache_key, data, 600)
        return Response(data)       