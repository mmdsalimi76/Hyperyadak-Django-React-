from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Profile, Address, Order, OrderItem


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name = "پروفایل"
    verbose_name_plural = "پروفایل"


class AddressInline(admin.TabularInline):
    model = Address
    extra = 0
    fields = ('full_address', 'city', 'state', 'postal_code')
    


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('total_price',)
    fields = ('product_id', 'product_name', 'quantity', 'unit_price', 'total_price')
    
    def has_add_permission(self, request, obj=None):
        return obj is not None  


class OrderInline(admin.TabularInline):
    model = Order
    extra = 0
    readonly_fields = ('order_number', 'total_amount', 'created_date')
    fields = ('order_number', 'total_amount', 'status', 'tracking_code', 'created_date')
    raw_id_fields = ('address',)
    show_change_link = True  # allows clicking to full order edit (with OrderItem inline)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('phone_number', 'is_staff', 'is_active', 'phone_verified', 'created_date')
    list_filter = ('is_staff', 'is_active', 'phone_verified', 'created_date')
    search_fields = ('phone_number',)
    ordering = ('-created_date',)
    
    fieldsets = (
        (None, {'fields': ('phone_number', 'password')}),
        (_('Permissions'), {
            'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'created_date', 'updated_date')}),
        (_('Verification'), {'fields': ('phone_verified',)}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone_number', 'password1', 'password2'),
        }),
    )
    
    inlines = [ProfileInline, AddressInline, OrderInline]
    readonly_fields = ('created_date', 'updated_date', 'last_login')


# Profile, Address, OrderItem are NOT registered as top-level models.
# Only Order is registered for search and support.

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    Top-level Order admin – for support to search by order number.
    Still includes OrderItem inline.
    """
    list_display = ('order_number', 'user', 'total_amount', 'status', 'created_date', 'tracking_code')
    list_filter = ('status', 'created_date', 'updated_date')
    search_fields = ('order_number', 'user__phone_number', 'tracking_code', 'payment_transaction_id')
    raw_id_fields = ('user', 'address')
    readonly_fields = ('order_number', 'total_amount', 'created_date', 'updated_date')
    inlines = [OrderItemInline]
    
    fieldsets = (
        (None, {'fields': ('order_number', 'user', 'address', 'total_amount', 'status')}),
        (_('پرداخت و ارسال'), {'fields': ('payment_transaction_id', 'tracking_code')}),
        (_('تاریخ'), {'fields': ('created_date', 'updated_date'), 'classes': ('collapse',)}),
    )
    
    actions = ['mark_as_paid', 'mark_as_shipped', 'mark_as_delivered']
    
    def mark_as_paid(self, request, queryset):
        queryset.update(status='paid')
    mark_as_paid.short_description = "علامت‌گذاری به عنوان پرداخت شده"
    
    def mark_as_shipped(self, request, queryset):
        queryset.update(status='shipped')
    mark_as_shipped.short_description = "علامت‌گذاری به عنوان ارسال شده"
    
    def mark_as_delivered(self, request, queryset):
        queryset.update(status='delivered')
    mark_as_delivered.short_description = "علامت‌گذاری به عنوان تحویل داده شده"