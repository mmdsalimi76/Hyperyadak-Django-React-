from django.urls import path
from . import views

app_name = 'api-v1'

urlpatterns = [
    # Create a payment request → returns Zarinpal gateway URL
    path('create/', views.CreatePaymentApiView.as_view(), name='payment-create'),

    # Called by frontend after Zarinpal redirects back; verifies & updates status
    path('verify/', views.VerifyPaymentApiView.as_view(), name='payment-verify'),

    # List the logged-in user's payment history
    path('list/', views.PaymentListApiView.as_view(), name='payment-list'),
]
