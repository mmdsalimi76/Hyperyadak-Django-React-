# products/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.utils.text import slugify
from .models import Category, CarBrand, CarModel, ProductBrand, Product, ProductImage,ProductComment
from django_json_widget.widgets import JSONEditorWidget
from django.db import models

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent', 'created_date')
    list_filter = ('parent', 'created_date')
    search_fields = ('name', 'slug', 'description')
    prepopulated_fields = {'slug': ('name',)}
    raw_id_fields = ('parent',)
    ordering = ('name',)
    fieldsets = (
        (None, {'fields': ('name', 'slug', 'parent')}),
        ('توضیحات و تصویر', {'fields': ('description', 'image')}),
        ('تاریخ', {'fields': ('created_date', 'updated_date'), 'classes': ('collapse',)}),
    )
    readonly_fields = ('created_date', 'updated_date')


class CarModelInline(admin.TabularInline):
    """Inline for editing CarModel objects directly under a CarBrand."""
    model = CarModel
    extra = 1
    fields = ('name', 'slug', 'image', 'created_date')
    readonly_fields = ('created_date',)
    prepopulated_fields = {'slug': ('name',)}
    show_change_link = True


@admin.register(CarBrand)
class CarBrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_date')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)
    inlines = [CarModelInline]
    fieldsets = (
        (None, {'fields': ('name', 'slug', 'logo')}),
        ('تاریخ', {'fields': ('created_date',), 'classes': ('collapse',)}),
    )
    readonly_fields = ('created_date',)


@admin.register(CarModel)
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'slug', 'image_preview', 'created_date')
    list_filter = ('brand',)
    search_fields = ('name', 'brand__name')
    prepopulated_fields = {'slug': ('name',)}  
    raw_id_fields = ('brand',)
    ordering = ('brand__name', 'name')
    fieldsets = (
        (None, {'fields': ('brand', 'name', 'slug', 'image')}),
        ('تاریخ', {'fields': ('created_date',), 'classes': ('collapse',)}),
    )
    readonly_fields = ('created_date',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: auto;" />', obj.image.url)
        return '-'
    image_preview.short_description = 'تصویر'

    def save_model(self, request, obj, form, change):
        if not obj.slug:
            base_slug = slugify(f"{obj.brand.name} {obj.name}", allow_unicode=True)
            obj.slug = base_slug
        super().save_model(request, obj, form, change)


@admin.register(ProductBrand)
class ProductBrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_date')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)
    fieldsets = (
        (None, {'fields': ('name', 'slug', 'logo', 'description')}),
        ('تاریخ', {'fields': ('created_date',), 'classes': ('collapse',)}),
    )
    readonly_fields = ('created_date',)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'is_main')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'brand', 'category', 'price', 'discount_price', 'discount_percent_display',
        'final_price_display', 'stock', 'is_available', 'is_hotsale', 'thumbnail_preview', 'created_date'
    )
    list_filter = ('brand', 'category', 'is_available', 'is_hotsale', 'compatible_cars', 'created_date')
    search_fields = ('name', 'slug', 'description', 'specifications')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('price', 'discount_price', 'stock', 'is_available', 'is_hotsale')
    readonly_fields = ('created_date', 'updated_date', 'discount_percent_display', 'final_price_display', 'thumbnail_preview')
    raw_id_fields = ('category', 'brand')
    filter_horizontal = ('compatible_cars',)
    ordering = ('-created_date',)
    inlines = [ProductImageInline] 
    fieldsets = (
        (None, {'fields': ('name', 'slug', 'brand', 'category')}),
        ('خودروهای سازگار', {'fields': ('compatible_cars',)}),
        ('توضیحات و رسانه', {'fields': ('description', 'specifications', 'video_url', 'thumbnail')}), 
        ('قیمت و موجودی', {'fields': ('price', 'discount_price', 'stock', 'is_available', 'is_hotsale')}),
        ('تاریخ', {'fields': ('created_date', 'updated_date'), 'classes': ('collapse',)}),
    )
    formfield_overrides = {
        models.JSONField: {'widget': JSONEditorWidget},
    }

    def discount_percent_display(self, obj):
        percent = obj.discount_percent
        if percent is not None:
            return format_html('<span style="color: green;">{}%</span>', percent)
        return '-'
    discount_percent_display.short_description = 'درصد تخفیف'

    def final_price_display(self, obj):
        return f'{obj.final_price:,} تومان'
    final_price_display.short_description = 'قیمت نهایی'

    def thumbnail_preview(self, obj):
        if obj.thumbnail:
            return format_html('<img src="{}" style="width: 50px; height: auto;" />', obj.thumbnail.url)
        return '-'
    thumbnail_preview.short_description = 'تصویر کوچک'


@admin.register(ProductComment)
class ProductCommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'user', 'is_approved', 'created_date')
    list_filter = ('is_approved', 'created_date', 'product')
    search_fields = ('user__phone_number', 'user__profile__first_name', 'user__profile__last_name', 'text')
    list_editable = ('is_approved',)
    readonly_fields = ('created_date', 'updated_date')
    fieldsets = (
        (None, {
            'fields': ('product', 'user', 'text', 'admin_reply')
        }),
        ('وضعیت', {
            'fields': ('is_approved',)
        }),
        ('زمان', {
            'fields': ('created_date', 'updated_date'),
            'classes': ('collapse',)
        })
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('product', 'user')