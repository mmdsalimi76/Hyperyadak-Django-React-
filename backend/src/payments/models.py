from django.db import models
from django.conf import settings

class Payment(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "در انتظار پرداخت"),
        ("PAID", "پرداخت موفق"),
        ("FAILED", "پرداخت ناموفق"),
        ("CANCELED", "لغو شده"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments",
        verbose_name="کاربر",
    )
    order = models.ForeignKey(
        "accounts.Order",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="payments",
        verbose_name="سفارش",
    )
    amount = models.PositiveIntegerField(verbose_name="مبلغ (ریال)")
    currency = models.CharField(max_length=3, default="IRR", verbose_name="واحد پول")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING", verbose_name="وضعیت")
    zarinpal_authority = models.CharField(max_length=255, blank=True, verbose_name="Authority")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="ساخته شد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="به‌روزرسانی شد")

    class Meta:
        verbose_name = "پرداخت"
        verbose_name_plural = "پرداخت‌ها"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.id} – {self.user.phone_number} – {self.amount}R"
