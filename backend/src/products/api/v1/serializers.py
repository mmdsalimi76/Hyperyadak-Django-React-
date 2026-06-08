# products/serializers.py
from rest_framework import serializers
from ...models import Category, CarBrand, CarModel, ProductBrand, Product, ProductImage, ProductComment


class CarModelSerializer(serializers.ModelSerializer):
    """Serializer for CarModel."""
    brand_name = serializers.CharField(source='brand.name', read_only=True)

    class Meta:
        model = CarModel
        fields = ['id', 'name', 'slug', 'brand', 'brand_name', 'image', 'created_date']
        read_only_fields = ['id', 'slug', 'created_date']
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class CarBrandSerializer(serializers.ModelSerializer):
    """Serializer for CarBrand, including nested models."""
    models = CarModelSerializer(many=True, read_only=True)

    class Meta:
        model = CarBrand
        fields = ['id', 'name', 'slug', 'logo', 'models', 'created_date']
        read_only_fields = ['id', 'slug', 'created_date']


class ProductBrandSerializer(serializers.ModelSerializer):
    """Serializer for ProductBrand (manufacturer brand like Bosch, ZF)."""
    class Meta:
        model = ProductBrand
        fields = ['id', 'name', 'slug', 'logo', 'description', 'created_date']
        read_only_fields = ['id', 'slug', 'created_date']


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model. Supports hierarchical representation."""
    children = serializers.SerializerMethodField()
    parent_name = serializers.CharField(source='parent.name', read_only=True)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'parent', 'parent_name',
            'description', 'image', 'children', 'created_date'
        ]
        read_only_fields = ['id', 'slug', 'created_date', 'updated_date']

    def get_children(self, obj):
        """Return nested children categories."""
        if obj.children.exists():
            return CategorySerializer(obj.children.all(), many=True).data
        return []


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image', 'is_main']


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product. Includes computed fields, category info, compatible cars, and brand."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    brand_slug = serializers.CharField(source='brand.slug', read_only=True)
    final_price = serializers.ReadOnlyField()
    discount_percent = serializers.ReadOnlyField()
    thumbnail_url = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    compatible_cars = CarModelSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'brand', 'brand_name', 'brand_slug',
            'category', 'category_name', 'category_slug',
            'description', 'specifications', 'video_url',
            'price', 'discount_price', 'final_price', 'discount_percent',
            'stock', 'is_available', 'is_hotsale', 'thumbnail', 'thumbnail_url', 'images',
            'compatible_cars', 'created_date', 'updated_date'
        ]
        read_only_fields = ['id', 'slug', 'created_date', 'updated_date', 'final_price', 'discount_percent']

    def get_thumbnail_url(self, obj):
        """Return absolute URL of the product thumbnail if exists."""
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None



class ProductCommentSerializer(serializers.ModelSerializer):
    """Read-only serializer for public display (only approved comments)."""
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    user_name = serializers.SerializerMethodField()
    product_title = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = ProductComment
        fields = [
            'id', 'product', 'product_title', 'text',
            'user_phone', 'user_name', 'created_date','admin_reply',
        ]
        read_only_fields = fields  

    def get_user_name(self, obj):
        """Return user's full name from profile, or fallback to phone number."""
        profile = getattr(obj.user, 'profile', None)
        if profile and (profile.first_name or profile.last_name):
            return f"{profile.first_name} {profile.last_name}".strip()
        return obj.user.phone_number


class ProductCommentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new comment. User is set automatically."""
    class Meta:
        model = ProductComment
        fields = ['product', 'text']
        extra_kwargs = {
            'product': {'required': True},
            'text': {'required': True}
        }

    def create(self, validated_data):
        # Set the user from the request context (must be passed in view)
        request = self.context.get('request')
        validated_data['user'] = request.user
        # is_approved defaults to False (needs admin approval)
        return super().create(validated_data)


class ProductCommentAdminSerializer(serializers.ModelSerializer):
    """Full serializer for admin use (includes is_approved)."""
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)

    class Meta:
        model = ProductComment
        fields = '__all__'
        read_only_fields = ['id', 'created_date', 'updated_date']


