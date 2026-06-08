from django.urls import path, include
from . import views

app_name = 'api-v1'

urlpatterns = [
    # Registration
    path('registration/', views.RegistrationApiView.as_view(), name='registration'),
    
    # Profile
    path('profile/', views.ProfileAPIView.as_view(), name='profile'),
    
    # Change Password
    path('change-password/', views.ChangePasswordAPIView.as_view(), name='change-password'),
    path('send-otp/', views.SendOTPApiView.as_view(), name='send-otp'),
    path('verify-otp/', views.VerifyOTPApiView.as_view(), name='verify-otp'),
    path('reset-password/', views.ResetPasswordApiView.as_view(), name='reset-password'),
    # dashboard
    path('dashboard/', views.DashboardAPIView.as_view(), name='dashboard'),
    # handle add address
    path('address/', views.AddressAPIView.as_view(), name='address'),
    
    # Order detail
    path('orders/<int:order_id>/', views.OrderDetailAPIView.as_view(), name='order-detail'),
    path('orders/<int:order_id>/cancel/', views.CancelOrderAPIView.as_view(), name='order-cancel'),
    path('orders/<int:order_id>/pay/', views.PayOrderAPIView.as_view(), name='order-pay'),
    path('orders/create/', views.OrderCreateAPIView.as_view(), name='order-create'),
    
    

]