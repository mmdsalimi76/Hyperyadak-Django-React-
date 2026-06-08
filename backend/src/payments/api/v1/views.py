from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.conf import settings
from django.shortcuts import get_object_or_404
import requests
from django.conf import settings
from .serializers import PaymentCreateSerializer, PaymentListSerializer
from ...models import Payment



# ─── Create Payment ───────────────────────────────────────────────────────────
class CreatePaymentApiView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentCreateSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        payment = serializer.save()

        payload = {
            'merchant_id': settings.ZARINPAL_MERCHANT_ID,
            'amount': payment.amount,
            'callback_url': f'{settings.FRONTEND_BASE_URL}/payment-callback',
            'description': f'پرداخت سفارش {payment.order.order_number if payment.order else payment.id}',
            'metadata': {'mobile': request.user.phone_number},
        }
        try:
            resp = requests.post(settings.ZARINPAL_REQUEST_URL, json=payload, timeout=10)
            resp.raise_for_status()
            data = resp.json()
        except Exception:
            payment.status = 'FAILED'
            payment.save()
            return Response(
                {'detail': 'اتصال به درگاه پرداخت برقرار نشد. لطفاً دوباره تلاش کنید.'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        if data.get('data') and data['data'].get('authority'):
            authority = data['data']['authority']
            payment.zarinpal_authority = authority
            payment.save()
            payment_url = settings.ZARINPAL_START_PAY.format(authority=authority)
            return Response({'payment_url': payment_url, 'payment_id': payment.id})

        payment.status = 'FAILED'
        payment.save()
        return Response(
            {'detail': 'خطا در دریافت پاسخ از درگاه پرداخت'},
            status=status.HTTP_502_BAD_GATEWAY,
        )

# ─── Verify Payment ───────────────────────────────────────────────────────────
class VerifyPaymentApiView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        authority = request.GET.get('Authority')
        zp_status = request.GET.get('Status', '')

        if not authority:
            return Response({'detail': 'Authority موجود نیست'}, status=status.HTTP_400_BAD_REQUEST)

        payment = get_object_or_404(Payment, zarinpal_authority=authority)

        if zp_status != 'OK':
            payment.status = 'CANCELED'
            payment.save()
            return Response({'status': 'CANCELED', 'payment_id': payment.id}, status=status.HTTP_200_OK)

        payload = {
            'merchant_id': settings.ZARINPAL_MERCHANT_ID,
            'authority': authority,
            'amount': payment.amount,
        }
        try:
            resp = requests.post(settings.ZARINPAL_VERIFY_URL, json=payload, timeout=10)
            resp.raise_for_status()
            data = resp.json()
        except Exception:
            return Response({'detail': 'اتصال به درگاه پرداخت جهت تأیید برقرار نشد'}, status=status.HTTP_502_BAD_GATEWAY)

        code = data.get('data', {}).get('code')
        if code in (100, 101):
            payment.status = 'PAID'
            payment.save()
            if payment.order:
                payment.order.status = 'paid'
                payment.order.payment_transaction_id = str(data['data'].get('ref_id', authority))
                payment.order.save()
            return Response({'status': 'PAID', 'payment_id': payment.id})
        else:
            payment.status = 'FAILED'
            payment.save()
            return Response(
                {'status': 'FAILED', 'detail': data.get('errors')},
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )


# ─── List Payments ────────────────────────────────────────────────────────────
class PaymentListApiView(generics.ListAPIView):
    """
    GET /payments/api/v1/list/
    Returns the current user's payment history (latest first).
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentListSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user).select_related('order')
