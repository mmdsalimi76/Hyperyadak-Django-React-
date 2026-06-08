from django import forms
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Ticket, TicketMessage

class TicketMessageInline(admin.TabularInline):
    model = TicketMessage
    extra = 0
    fields = ('sender', 'message', 'created_date')
    readonly_fields = ('created_date',)
    raw_id_fields = ('sender',)

class TicketAdminForm(forms.ModelForm):
    admin_reply = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4, 'placeholder': 'پاسخ خود را برای کاربر در اینجا بنویسید...'}),
        required=False,
        label=_("پاسخ سریع پشتیبانی")
    )

    class Meta:
        model = Ticket
        fields = '__all__'

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    form = TicketAdminForm
    list_display = ('title', 'user', 'status', 'created_date', 'updated_date')
    list_filter = ('status', 'created_date', 'updated_date')
    search_fields = ('title', 'user__phone_number')
    raw_id_fields = ('user',)
    readonly_fields = ('created_date', 'updated_date')
    inlines = [TicketMessageInline]
    
    fieldsets = (
        (None, {'fields': ('title', 'user', 'status')}),
        (_('ارسال پاسخ سریع'), {'fields': ('admin_reply',)}),
        (_('تاریخ‌ها'), {'fields': ('created_date', 'updated_date')}),
    )

    def save_model(self, request, obj, form, change):
        """If admin_reply is filled, create a TicketMessage and update the ticket status to answered."""
        admin_reply = form.cleaned_data.get('admin_reply')
        if admin_reply:
            # Create message reply
            TicketMessage.objects.create(
                ticket=obj,
                sender=request.user,
                message=admin_reply
            )
            # Mark the ticket status as answered
            obj.status = 'answered'
        
        super().save_model(request, obj, form, change)

    def save_formset(self, request, form, formset, change):
        """Automatically assign the logged-in admin user as the sender for new inline messages."""
        instances = formset.save(commit=False)
        for instance in instances:
            if isinstance(instance, TicketMessage) and not instance.id:
                if not getattr(instance, 'sender_id', None):
                    instance.sender = request.user
            instance.save()
        formset.save_m2m()
