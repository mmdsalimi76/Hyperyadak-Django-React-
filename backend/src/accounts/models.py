from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator


class UserManager(BaseUserManager):
    """
    Custom user manager that uses phone number as the unique identifier.
    """
    def create_user(self, phone_number, password=None, **extra_fields):
        """Create and save a regular user with the given phone number and password."""
        if not phone_number:
            raise ValueError(_("شماره تلفن الزامی است"))  # Farsi
        phone_number = self.normalize_phone_number(phone_number)
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        """Create and save a superuser with the given phone number and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_("سوپر یوزر باید is_staff=True داشته باشد"))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_("سوپر یوزر باید is_superuser=True داشته باشد"))
        return self.create_user(phone_number, password, **extra_fields)

    def normalize_phone_number(self, phone_number):
        """Remove spaces, dashes, and extra characters from phone number."""
        return phone_number.strip()


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model where phone number is the unique identifier.
    No email field – authentication is purely by phone number.
    """
    phone_regex = RegexValidator(
        regex=r'^(09|\+989)\d{9}$',
        message=_("شماره تلفن معتبر ایران را وارد کنید. مثال: 09123456789 یا +989123456789")
    )
    phone_number = models.CharField(
        max_length=13,
        unique=True,
        validators=[phone_regex],
        verbose_name="شماره تلفن",
        help_text="شماره تلفن همراه با کد ایران (مثال: 09123456789 یا +989123456789)"
    )
    is_staff = models.BooleanField(
        default=False,
        verbose_name="کارمند",
        help_text="آیا این کاربر می‌تواند به پنل مدیریت دسترسی داشته باشد؟"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="فعال",
        help_text="آیا حساب کاربری فعال است؟"
    )
    phone_verified = models.BooleanField(
        default=False,
        verbose_name="تلفن تأیید شده",
        help_text="آیا شماره تلفن از طریق پیامک تأیید شده است؟"
    )
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_date = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = "کاربر"
        verbose_name_plural = "کاربران"

    def __str__(self):
        return self.phone_number


class Profile(models.Model):
    """
    One-to-one profile for each user containing personal information.
    No avatar, gender, or date of birth – only first and last name.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name="کاربر"
    )
    first_name = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="نام",
        help_text="نام (اختیاری)"
    )
    last_name = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="نام خانوادگی",
        help_text="نام خانوادگی (اختیاری)"
    )
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_date = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "پروفایل"
        verbose_name_plural = "پروفایل‌ها"

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.user.phone_number})"


class Address(models.Model):
    """
    Shipping address model for each user. Users can have multiple addresses
    and mark one as default.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='address',
        verbose_name="کاربر"
    )
    full_address = models.TextField(
        verbose_name="آدرس کامل",
        help_text="خیابان، پلاک، واحد، و غیره"
    )
    city = models.CharField(max_length=100, verbose_name="شهر")
    state = models.CharField(max_length=100, verbose_name="استان")
    postal_code = models.CharField(
        max_length=10,
        verbose_name="کد پستی",
        help_text="کد پستی ۱۰ رقمی"
    )
    
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_date = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "آدرس"
        verbose_name_plural = "آدرس‌ها"
        ordering = [ '-created_date',]

    def __str__(self):
        return f"{self.full_address}, {self.city}, {self.state}"


class Order(models.Model):
    """
    Represents a customer order. Contains shipping address, total amount,
    payment status, order status, and tracking info.
    """
    ORDER_STATUS_CHOICES = (
        ('pending', 'در انتظار پرداخت'),
        ('paid', 'پرداخت شده'),
        ('processing', 'در حال پردازش'),
        ('shipped', 'ارسال شده'),
        ('delivered', 'تحویل داده شده'),
        ('cancelled', 'لغو شده'),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name="کاربر"
    )
    address = models.ForeignKey(
        Address,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="آدرس ارسال"
    )
    order_number = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        verbose_name="شماره سفارش"
    )
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        verbose_name="مبلغ کل (تومان)"
    )
    status = models.CharField(
        max_length=20,
        choices=ORDER_STATUS_CHOICES,
        default='pending',
        verbose_name="وضعیت سفارش"
    )
    payment_transaction_id = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="شناسه پرداخت"
    )
    tracking_code = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="کد رهگیری پستی"
    )
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ سفارش")
    updated_date = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "سفارش"
        verbose_name_plural = "سفارش‌ها"
        ordering = ['-created_date']

    def __str__(self):
        return f"سفارش {self.order_number} - {self.user}"


class OrderItem(models.Model):
    """
    Individual item within an order. Stores product reference, quantity,
    and price at the time of purchase (snapshot).
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name="سفارش"
    )
    product_id = models.PositiveIntegerField(
        verbose_name="شناسه محصول"
    )
    product_name = models.CharField(
        max_length=255,
        verbose_name="نام محصول"
    )  # Snapshot
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="تعداد"
    )
    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        verbose_name="قیمت واحد (تومان)"
    )  # Snapshot
    total_price = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        editable=False,
        verbose_name="قیمت کل (تومان)"
    )

    class Meta:
        verbose_name = "آیتم سفارش"
        verbose_name_plural = "آیتم‌های سفارش"

    def save(self, *args, **kwargs):
        """Calculate total price before saving."""
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.product_name} (سفارش {self.order.order_number})"


# ---------- Signal to auto-create Profile ----------
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a Profile instance automatically when a User is created."""
    if created:
        Profile.objects.create(user=instance)