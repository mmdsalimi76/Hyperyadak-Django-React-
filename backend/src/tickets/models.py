from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Ticket(models.Model):
    STATUS_CHOICES = (
        ('open', _('باز')),
        ('pending', _('در انتظار پاسخ')),
        ('answered', _('پاسخ داده شده')),
        ('closed', _('بسته شده')),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tickets',
        verbose_name=_("کاربر")
    )
    title = models.CharField(max_length=255, verbose_name=_("عنوان"))
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='open',
        verbose_name=_("وضعیت")
    )
    created_date = models.DateTimeField(auto_now_add=True, verbose_name=_("تاریخ ایجاد"))
    updated_date = models.DateTimeField(auto_now=True, verbose_name=_("تاریخ بروزرسانی"))

    class Meta:
        verbose_name = _("تیکت")
        verbose_name_plural = _("تیکت‌ها")
        ordering = ['-updated_date']

    def __str__(self):
        return f"{self.title} - {self.user.phone_number} ({self.get_status_display()})"


class TicketMessage(models.Model):
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name=_("تیکت")
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name=_("فرستنده")
    )
    message = models.TextField(verbose_name=_("پیام"))
    created_date = models.DateTimeField(auto_now_add=True, verbose_name=_("تاریخ ارسال"))

    class Meta:
        verbose_name = _("پیام تیکت")
        verbose_name_plural = _("پیام‌های تیکت")
        ordering = ['created_date']

    def __str__(self):
        return f"پیام برای {self.ticket.title} از {self.sender.phone_number}"
