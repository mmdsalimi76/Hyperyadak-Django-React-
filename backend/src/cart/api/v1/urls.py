from django.urls import path
from . import views

urlpatterns = [
    path('', views.CartRetrieveView.as_view(), name='cart'),
    path('add/', views.AddToCartView.as_view(), name='add-to-cart'),
    path('update/<int:id>/', views.UpdateCartItemView.as_view(), name='update-cart-item'),
    path('remove/<int:id>/', views.RemoveCartItemView.as_view(), name='remove-cart-item'),
    path('checkout/', views.CheckoutView.as_view(), name='checkout'),
]