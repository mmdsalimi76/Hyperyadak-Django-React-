from django.urls import path, include
from . import views

app_name = 'api-v1'

urlpatterns = [
    # Category endpoints
    path('categories/', views.CategoryListAPIView.as_view(), name='category-list'),
    path('categories/<str:slug>/', views.CategoryRetrieveAPIView.as_view(), name='category-detail'),
    
    # Car Brand endpoints 
    path('brands/', views.CarBrandListAPIView.as_view(), name='brand-list'),
    path('brands/<str:slug>/', views.CarBrandRetrieveAPIView.as_view(), name='brand-detail'),
    
    # Car Model endpoints 
    path('models/', views.CarModelListAPIView.as_view(), name='model-list'),
    path('models/<str:slug>/', views.CarModelRetrieveAPIView.as_view(), name='model-detail'),
    
    # Product Brand endpoints 
    path('product-brands/', views.ProductBrandListAPIView.as_view(), name='product-brand-list'),
    path('product-brands/<slug:slug>/', views.ProductBrandRetrieveAPIView.as_view(), name='product-brand-detail'),
    
    # Product endpoints
    path('products/', views.ProductListAPIView.as_view(), name='product-list'),
    path('products/<str:slug>/', views.ProductRetrieveAPIView.as_view(), name='product-detail'),


    # comments
    path('products/<int:product_id>/comments/', views.ProductCommentListCreateView.as_view(), name='product-comments'),
    # home
    path('homepage-data/', views.HomepageDataAPIView.as_view(), name='homepage-data'),
]
