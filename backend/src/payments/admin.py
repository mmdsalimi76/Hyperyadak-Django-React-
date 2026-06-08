from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """
    Admin panel for Payment model.
    Allows support to search by user phone, order number, or status.
    """
    list_display = ('id', 'user', 'order', 'amount', 'status', 'zarinpal_authority', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__phone_number', 'order__order_number', 'zarinpal_authority')
    readonly_fields = ('created_at', 'updated_at', 'zarinpal_authority')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {
            'fields': ('user', 'order', 'amount', 'currency', 'status')
        }),
        (_('زارین‌پال'), {
            'fields': ('zarinpal_authority',),
        }),
        (_('تاریخ'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    actions = ['mark_as_paid', 'mark_as_failed', 'mark_as_canceled']

    def mark_as_paid(self, request, queryset):
        queryset.update(status='PAID')
    mark_as_paid.short_description = 'علامت‌گذاری به عنوان پرداخت موفق'

    def mark_as_failed(self, request, queryset):
        queryset.update(status='FAILED')
    mark_as_failed.short_description = 'علامت‌گذاری به عنوان پرداخت ناموفق'

    def mark_as_canceled(self, request, queryset):
        queryset.update(status='CANCELED')
    mark_as_canceled.short_description = 'علامت‌گذاری به عنوان لغو شده'
