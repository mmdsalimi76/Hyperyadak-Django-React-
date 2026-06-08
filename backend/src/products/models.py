# products/models.py
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator


class Category(models.Model):
    """
    Product category hierarchy (part types). Examples: Engine, Brakes, Suspension.
    Subcategories have a parent pointing to a main category.
    """
    name = models.CharField(max_length=100, verbose_name="نام دسته")
    slug = models.SlugField(unique=True, allow_unicode=True, verbose_name="اسلاگ")
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name="دسته والد"
    )
    description = models.TextField(blank=True, verbose_name="توضیحات")
    image = models.ImageField(
        upload_to='categories/',
        blank=True,
        null=True,
        verbose_name="تصویر"
    )
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_date = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "دسته‌بندی قطعات"
        verbose_name_plural = "دسته‌بندی قطعات"
        ordering = ['name']
        indexes = [
            models.Index(fields=['parent'], name='category_parent_idx'),
        ]
    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)


class CarBrand(models.Model):
    """Car brand (e.g., BMW, Toyota)"""
    name = models.CharField(max_length=50, unique=True, verbose_name="برند خودرو")
    slug = models.SlugField(unique=True, allow_unicode=True, verbose_name="اسلاگ")
    logo = models.ImageField(upload_to='brands/', blank=True, null=True, verbose_name="لوگو")
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "برند خودرو"
        verbose_name_plural = "برندهای خودرو"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)


class CarModel(models.Model):
    """Car model, optionally linked to a brand (e.g., BMW 3 Series, Toyota Camry)"""
    brand = models.ForeignKey(
        CarBrand,
        on_delete=models.CASCADE,
        related_name='models',
        verbose_name="برند"
    )
    name = models.CharField(max_length=100, verbose_name="نام مدل")
    slug = models.SlugField(allow_unicode=True, verbose_name="اسلاگ")
    image = models.ImageField(upload_to='car_models/', blank=True, null=True)
    
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "مدل خودرو"
        verbose_name_plural = "مدل‌های خودرو"
        ordering = ['brand__name', 'name']
        unique_together = ('brand', 'name')  
        indexes = [
            models.Index(fields=['brand'], name='carmodel_brand_idx'),
        ]
    def __str__(self):
        return f"{self.brand.name} {self.name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            # Example: bmw-3-series
            base_slug = slugify(f"{self.brand.name} {self.name}", allow_unicode=True)
            self.slug = base_slug
        super().save(*args, **kwargs)

class ProductBrand(models.Model):
    """Brand of the product manufacturer (e.g., Bosch, ZF, Brembo)."""
    name = models.CharField(max_length=100, unique=True, verbose_name="نام برند")
    slug = models.SlugField(unique=True, allow_unicode=True, verbose_name="اسلاگ")
    logo = models.ImageField(upload_to='product_brands/', blank=True, null=True, verbose_name="لوگو")
    description = models.TextField(blank=True, verbose_name="توضیحات")
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "برند محصول"
        verbose_name_plural = "برندهای محصول"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)
class Product(models.Model):
    """
    Main product model for car parts.
    Includes specifications, video, hot‑sale flag, and vehicle compatibility.
    """
    name = models.CharField(max_length=255, verbose_name="نام محصول")
    slug = models.SlugField(unique=True, allow_unicode=True, verbose_name="اسلاگ")
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name="دسته‌بندی قطعه"
    )
    description = models.TextField(verbose_name="توضیحات")

    # Specifications (flexible key-value store)
    specifications = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="مشخصات فنی",
        help_text="مثلاً {'سایز': '۵۰mm', 'جنس': 'چدن', 'برند': 'بوش'}"
    )
    brand = models.ForeignKey(
        ProductBrand,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
        verbose_name="برند محصول"
    )
    # Video introduction
    video_url = models.URLField(
        blank=True,
        null=True,
        verbose_name="لینک ویدیو",
        help_text="لینک یوتیوب یا آپارات"
    )

    # Pricing and stock
    price = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        verbose_name="قیمت (تومان)",
        validators=[MinValueValidator(0)]
    )
    discount_price = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        null=True,
        blank=True,
        verbose_name="قیمت تخفیف خورده",
        validators=[MinValueValidator(0)]
    )
    stock = models.PositiveIntegerField(default=0, verbose_name="موجودی")

    # Status flags
    is_available = models.BooleanField(default=True, verbose_name="موجود")
    is_hotsale = models.BooleanField(default=False, verbose_name="فروش ویژه")

    # Car compatibility (many-to-many)
    compatible_cars = models.ManyToManyField(
        CarModel,
        blank=True,
        related_name='products',
        verbose_name="خودروهای سازگار"
    )

    thumbnail = models.ImageField(
        upload_to='products/thumbnails/',
        blank=True,
        null=True,
        verbose_name="تصویر کوچک"
    )

    # Timestamps
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_date = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"
        ordering = ['-created_date']
        indexes = [
            models.Index(fields=['category'], name='product_category_idx'),
            models.Index(fields=['is_hotsale'], name='product_hotsale_idx'),
            models.Index(fields=['brand'], name='product_brand_idx'),
            models.Index(fields=['is_available'], name='product_available_idx'),
            models.Index(fields=['category', 'is_available'], name='product_cat_avail_idx'),
        ]
    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)

    @property
    def final_price(self):
        """Return discounted price if available, otherwise the normal price."""
        return self.discount_price if self.discount_price else self.price

    @property
    def discount_percent(self):
        """Calculate discount percentage."""
        if self.discount_price and self.price > 0:
            percent = ((self.price - self.discount_price) / self.price) * 100
            return round(percent, 0)
        return None


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name="محصول"
    )
    image = models.ImageField(
        upload_to='products/images/',
        verbose_name="تصویر"
    )
    is_main = models.BooleanField(default=False, verbose_name="تصویر اصلی")

    class Meta:
        verbose_name = "تصویر محصول"
        verbose_name_plural = "تصاویر محصول"
        ordering = ['product', '-is_main']

    def __str__(self):
        return f"Image for {self.product.name}"






class ProductComment(models.Model):
    """
    User comments and ratings for a product.
    """
    

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name="محصول"
    )
    user = models.ForeignKey(
        'accounts.User',  
        on_delete=models.CASCADE,
        related_name='product_comments',
        verbose_name="کاربر"
    )
    text = models.TextField(verbose_name="متن نظر")
    
    is_approved = models.BooleanField(
        default=False,
        verbose_name="تأیید شده",
        help_text="فقط نظرات تأیید شده در سایت نمایش داده می‌شوند."
    )
    admin_reply = models.TextField(blank=True, null=True, verbose_name="پاسخ ادمین")
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_date = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "نظر محصول"
        verbose_name_plural = "نظرات محصولات"
        ordering = ['-created_date']
        indexes = [
            models.Index(fields=['product'], name='comment_product_idx'),
            models.Index(fields=['is_approved'], name='comment_approved_idx'),
        ]
    def __str__(self):
        return f"نظر {self.user.phone_number} برای {self.product.name}"