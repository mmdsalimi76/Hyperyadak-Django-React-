from django.urls import path,include


app_name='products'

urlpatterns = [
    path('',include('django.contrib.auth.urls')),
    path('api/v1/',include('products.api.v1.urls')),
]