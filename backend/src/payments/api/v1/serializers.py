from rest_framework import serializers
from ...models import Payment
from accounts.models import Order


class PaymentCreateSerializer(serializers.Serializer):
    """
    Validates a payment request.
    Expects: order_id (order_number string), amount (integer in Rial).
    """
    order_id = serializers.CharField()
    amount = serializers.IntegerField(min_value=1000)

    def validate(self, data):
        user = self.context['request'].user
        try:
            order = Order.objects.get(order_number=data['order_id'], user=user)
        except Order.DoesNotExist:
            raise serializers.ValidationError({'order_id': 'سفارش یافت نشد یا متعلق به شما نیست'})
        
        if order.status != 'pending':
            raise serializers.ValidationError({'order_id': 'این سفارش قبلاً پرداخت شده یا لغو شده است'})
        data['order'] = order
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        payment = Payment.objects.create(
            user=user,
            order=validated_data['order'],
            amount=validated_data['amount'],
        )
        return payment


class PaymentListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing a user's payments.
    """
    order_number = serializers.CharField(source='order.order_number', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order_number', 'amount', 'currency', 'status', 'created_at']
        read_only_fields = fields
