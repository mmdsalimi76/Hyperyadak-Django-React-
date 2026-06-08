from rest_framework import serializers
from ...models import Cart, CartItem

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.final_price', read_only=True, max_digits=12, decimal_places=0)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'product_price', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.get_total_price()

class CartItemCreateSerializer(CartItemSerializer):
    class Meta(CartItemSerializer.Meta):
        extra_kwargs = {
            'product': {'write_only': True},
            'quantity': {'min_value': 1},
        }

class CartItemUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['quantity']
        extra_kwargs = {
            'quantity': {'min_value': 1},
        }

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price']

    def get_total_price(self, obj):
        return obj.get_total_price()