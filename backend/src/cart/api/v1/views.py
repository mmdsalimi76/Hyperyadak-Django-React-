from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from ...models import Cart, CartItem
from .serializers import CartSerializer, CartItemCreateSerializer, CartItemUpdateSerializer
from accounts.models import Order, OrderItem
import uuid

class CartRetrieveView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartSerializer

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

class AddToCartView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartItemCreateSerializer

    def perform_create(self, serializer):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        product = serializer.validated_data['product']
        quantity = serializer.validated_data.get('quantity', 1)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        else:
            cart_item.quantity = quantity
            cart_item.save()
        serializer.instance = cart_item

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        cart = Cart.objects.get(user=request.user)
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=response.status_code)

class UpdateCartItemView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartItemUpdateSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance.quantity = serializer.validated_data['quantity']
        instance.save()
        cart = Cart.objects.get(user=request.user)
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data)

class RemoveCartItemView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        cart = Cart.objects.get(user=request.user)
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_200_OK)


class CheckoutView(APIView):
    """Create an order from the user's cart."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response(
                {'detail': 'سبد خرید خالی است'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not cart.items.exists():
            return Response(
                {'detail': 'سبد خرید شما خالی است'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user has address
        address = getattr(request.user, 'address', None)
        if not address:
            return Response(
                {'detail': 'لطفاً ابتدا آدرس خود را ثبت کنید'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate unique order number
        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"

        # Calculate total amount
        total_amount = cart.get_total_price()

        # Create order
        order = Order.objects.create(
            user=request.user,
            address=address,
            order_number=order_number,
            total_amount=total_amount
        )

        # Create order items from cart items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product_id=cart_item.product.id,
                product_name=cart_item.product.name,
                quantity=cart_item.quantity,
                unit_price=cart_item.product.final_price
            )

        # Clear cart
        cart.items.all().delete()

        return Response(
            {
                'order_id': order.id,
                'order_number': order.order_number,
                'total_amount': str(order.total_amount)
            },
            status=status.HTTP_201_CREATED
        )