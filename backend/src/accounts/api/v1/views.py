from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import update_session_auth_hash
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .serializers import ProfileSerializer, ChangePasswordSerializer, RegistrationSerializer, AddressSerializer, ResetPasswordSerializer, OrderDetailSerializer
from ...models import User, Profile, Address, Order, OrderItem
from django.db.models import Prefetch
from rest_framework.views import APIView
from .serializers import DashboardSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from ... import sms
from payments.api.v1.serializers import PaymentCreateSerializer
from django.conf import settings
import requests
from payments.models import Payment
import uuid
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from .serializers import OrderCreateSerializer
from accounts.tasks import send_otp_task
from django.conf import settings


class RegistrationApiView(generics.GenericAPIView):
    """
    API endpoint for user registration using phone number and password.
    """
    serializer_class = RegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            data = {
                'phone_number': user.phone_number,
                'message': 'کاربر با موفقیت ایجاد شد'  
            }
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileAPIView(generics.RetrieveUpdateAPIView):
    """
    Retrieve and update the authenticated user's profile.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        # Get or create profile for the current user
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile


class ChangePasswordAPIView(generics.GenericAPIView):
    """
    API endpoint for authenticated users to change their password.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            current_password = serializer.validated_data['current_password']
            new_password = serializer.validated_data['new_password']

            # Check current password
            if not user.check_password(current_password):
                return Response(
                    {'current_password': ['رمز عبور فعلی اشتباه است']},  
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate new password strength
            try:
                validate_password(new_password, user)
            except ValidationError as e:
                return Response(
                    {'new_password': list(e.messages)},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Set new password and keep session active
            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user)

            return Response(
                {'message': 'رمز عبور با موفقیت به‌روزرسانی شد'},  
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class DashboardAPIView(APIView):
    """
    API endpoint for fetching the Dashboard.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        
        profile = Profile.objects.select_related('user', 'user__address').prefetch_related(
            Prefetch('user__orders', queryset=Order.objects.exclude(status='cancelled'), to_attr='paid_orders'),
            'user__tickets'
        ).get(user=request.user)

        serializer = DashboardSerializer(profile)
        return Response(serializer.data)       





class AddressAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        address = getattr(request.user, 'address', None)
        if not address:
            return Response({'detail': 'آدرسی یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AddressSerializer(address)
        return Response(serializer.data)

    def post(self, request):
        
        if hasattr(request.user, 'address'):
            return Response({'detail': 'آدرس قبلاً ثبت شده است. از PUT استفاده کنید.'},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        address = getattr(request.user, 'address', None)
        if not address:
            return Response({'detail': 'آدرسی برای ویرایش وجود ندارد'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AddressSerializer(address, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        address = getattr(request.user, 'address', None)
        if address:
            address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)


class CancelOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        if order.status == 'pending':
            order.status = 'cancelled'
            order.save()
            return Response({'message': 'Order cancelled successfully'}, status=status.HTTP_200_OK)
        return Response({'message': 'Order cannot be cancelled'}, status=status.HTTP_400_BAD_REQUEST)


class PayOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        if order.status != 'pending':
            return Response({'detail': 'Order is not pending'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PaymentCreateSerializer(
            data={'amount': int(order.total_amount) * 10, 'order_id': order.order_number},
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        payload = {
            'merchant_id': settings.ZARINPAL_MERCHANT_ID,
            'amount': validated_data['amount'],
            'callback_url': f'{settings.FRONTEND_BASE_URL}/payment-callback',
            'description': f'پرداخت سفارش {order.order_number}',
            'metadata': {'mobile': request.user.phone_number},
        }
        try:
            resp = requests.post(settings.ZARINPAL_REQUEST_URL, json=payload, timeout=10)
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            print(f"Error connecting to Zarinpal: {e}")
            return Response(
                {'detail': f'اتصال به درگاه پرداخت برقرار نشد. خطا: {str(e)}'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        if data.get('data') and data['data'].get('authority'):
            authority = data['data']['authority']
            payment = Payment.objects.create(
                user=request.user,
                order=order,
                amount=validated_data['amount'],
                zarinpal_authority=authority,
            )
            payment_url = settings.ZARINPAL_START_PAY.format(authority=authority)
            return Response({'payment_url': payment_url, 'payment_id': payment.id})

        return Response(
            {'detail': 'خطا در دریافت پاسخ از درگاه پرداخت'},
            status=status.HTTP_502_BAD_GATEWAY,
        )



class SendOTPApiView(APIView):
    """Generate and send OTP to a phone number asynchronously (via Celery)."""
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        if not phone_number:
            return Response({'detail': 'phone_number is required'}, status=status.HTTP_400_BAD_REQUEST)

        from django.core.cache import cache
        cache_key = f"otp:{phone_number}"
        otp = cache.get(cache_key)
        if not otp:
            otp = sms.generate_otp()
            sms.cache_otp(phone_number, otp)   

        
        send_otp_task.delay(phone_number, otp)

        
        return Response({'message': 'کد تایید در حال ارسال است'}, status=status.HTTP_200_OK)

class VerifyOTPApiView(APIView):
    """Verify OTP for a phone number."""
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        otp = request.data.get('otp')
        if not phone_number or not otp:
            return Response({'detail': 'phone_number and otp are required'}, status=status.HTTP_400_BAD_REQUEST)
        if sms.verify_otp(phone_number, otp):
            return Response({'message': 'OTP verified'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)       

class ResetPasswordApiView(APIView):
    """Validate OTP and set a new password for the user (forgot password flow)."""
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        phone_number = serializer.validated_data['phone_number']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']
        # Verify OTP
        if not sms.verify_otp(phone_number, otp):
            return Response({'detail': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
        # Get user and set new password
        try:
            user = User.objects.get(phone_number=phone_number)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)





class OrderCreateAPIView(APIView):
    """
    Accepts client-side cart data right after authentication 
    and converts it into a formal database Order.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        address = Address.objects.get(id=validated_data['address_id'])
        cart_items = validated_data['items']

        if not cart_items:
            return Response({'detail': 'سبد خرید شما خالی است.'}, status=status.HTTP_400_BAD_REQUEST)

        # Execute atomically to prevent partial order creation
        with transaction.atomic():
            # 1. Generate a unique order number (e.g., ORD-timestamp-random)
            order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
            
            # 2. Calculate global total amount
            total_amount = sum(item['quantity'] * item['unit_price'] for item in cart_items)

            # 3. Create core Order
            order = Order.objects.create(
                user=request.user,
                address=address,
                order_number=order_number,
                total_amount=total_amount,
                status='pending'
            )

            # 4. Create snapshot OrderItems
            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product_id=item['product_id'],
                    product_name=item['product_name'],
                    quantity=item['quantity'],
                    unit_price=item['unit_price']
                    
                )

        return Response({
            'message': 'سفارش با موفقیت ثبت شد',
            'order_id': order.id,
            'order_number': order.order_number,
            'total_amount': order.total_amount
        }, status=status.HTTP_201_CREATED)        