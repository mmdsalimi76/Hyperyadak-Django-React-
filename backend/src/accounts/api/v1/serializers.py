from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from ...models import User, Profile, Address, Order, OrderItem  
from rest_framework import serializers
from ...models import Order, OrderItem, Address

class RegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration using phone number and password.
    """
    password1 = serializers.CharField(max_length=255, write_only=True)

    class Meta:
        model = User
        fields = ['phone_number', 'password', 'password1']

    def validate(self, attrs):
        # Check that passwords match
        if attrs.get('password') != attrs.get('password1'):
            raise serializers.ValidationError({'detail': 'رمزهای عبور مطابقت ندارند'})  

        # Validate password strength
        try:
            validate_password(attrs.get('password'))
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})

        return attrs

    def create(self, validated_data):
        # Remove password1 and create user using custom manager
        validated_data.pop('password1', None)
        return User.objects.create_user(**validated_data)


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Profile model (read-only phone number included for convenience).
    """
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'first_name', 'last_name', 'phone_number']
        read_only_fields = ['id', 'phone_number']


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    current_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "رمزهای عبور جدید مطابقت ندارند"})
        return attrs


class ResetPasswordSerializer(serializers.Serializer):
    """Serializer for resetting password via OTP"""
    phone_number = serializers.CharField(required=True)
    otp = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'رمزهای عبور جدید مطابقت ندارند'})
        # Validate password strength
        try:
            validate_password(attrs['new_password'])
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({'new_password': list(e.messages)})
        return attrs




class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'full_address', 'city', 'state', 'postal_code']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'quantity', 'unit_price', 'total_price']
        read_only_fields = ['total_price']


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    address = AddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'total_amount', 'status', 'address', 'items', 'created_date']
        read_only_fields = ['id', 'order_number', 'total_amount', 'status', 'address', 'items', 'created_date']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    address = AddressSerializer(read_only=True) # Add this line

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user_phone', 'address', 'total_amount',
                  'status', 'payment_transaction_id', 'tracking_code', 'created_date', 'items']
        read_only_fields = ['order_number', 'created_date', 'total_amount', 'address'] # Add 'address' to read_only_fields

class DashboardSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source='user.phone_number')
    address = AddressSerializer(source='user.address')
    orders = OrderSerializer(source='user.paid_orders', many=True)
    active_tickets_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'phone_number', 'address', 'orders', 'active_tickets_count']

    def get_active_tickets_count(self, obj):
        # Count tickets that are not closed
        return obj.user.tickets.exclude(status='closed').count()




class CartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField(max_length=255)
    quantity = serializers.IntegerField(min_value=1)
    unit_price = serializers.DecimalField(max_digits=12, decimal_places=0)

class OrderCreateSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    items = CartItemSerializer(many=True)

    def validate_address_id(self, value):
        
        user = self.context['request'].user
        if not Address.objects.filter(id=value, user=user).exists():
            raise serializers.ValidationError("آدرس انتخاب شده معتبر نیست.")
        return value