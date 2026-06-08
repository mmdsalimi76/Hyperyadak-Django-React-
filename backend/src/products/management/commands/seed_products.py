import os
import random
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.core.files import File
from django.conf import settings
from faker import Faker
from products.models import Category, CarBrand, CarModel, ProductBrand, Product, ProductImage


class Command(BaseCommand):
    help = "Populates the database with 20 categories, 20 car brands (with models), 20 product brands, and 50 products using existing high-res media files."

    def get_random_file(self, relative_folder_path):
        """Safely grabs a random file pointer from a folder inside the media root."""
        folder_path = os.path.join(settings.MEDIA_ROOT, relative_folder_path)

        if not os.path.exists(folder_path):
            return None

        # Filter out hidden files or system files like .gitignore/.DS_Store
        files = [
            f for f in os.listdir(folder_path)
            if os.path.isfile(os.path.join(folder_path, f)) and not f.startswith('.')
        ]

        if not files:
            return None

        random_file_name = random.choice(files)
        full_file_path = os.path.join(folder_path, random_file_name)

        # Open the file in binary mode and return it wrapped in Django's File handler
        opened_file = open(full_file_path, 'rb')
        return File(opened_file, name=random_file_name)

    def handle(self, *args, **kwargs):
        fake = Faker(['en_US'])
        self.stdout.write(self.style.WARNING("Starting data seeding with local media assets..."))

        # ---------- 1. Create 20 Categories ----------
        categories_data = [
            'Engine Parts', 'Brake Systems', 'Suspension & Steering', 'Electrical Components', 'Filters',
            'Cooling System', 'Exhaust System', 'Fuel System', 'Transmission', 'Drivetrain',
            'HVAC System', 'Body & Interior', 'Lighting & Lamps', 'Wheels & Tires', 'Battery & Charging',
            'Ignition System', 'Sensors & Electronics', 'Belts & Hoses', 'Gaskets & Seals', 'Turbo & Supercharger'
        ]
        categories = []
        for cat_name in categories_data:
            cat_img = self.get_random_file('categories')
            category, _ = Category.objects.get_or_create(
                name=cat_name,
                defaults={
                    'slug': slugify(cat_name),
                    'description': f"High quality components for {cat_name}.",
                    'image': cat_img
                }
            )
            categories.append(category)
        self.stdout.write(f"✅ Created/verified {len(categories)} categories")

        # ---------- 2. Create 20 Car Brands (each with 2-4 models) ----------
        car_brands_list = [
            'Toyota', 'BMW', 'Peugeot', 'Kia', 'Honda', 'Ford', 'Chevrolet', 'Mercedes-Benz',
            'Audi', 'Nissan', 'Hyundai', 'Volkswagen', 'Mazda', 'Subaru', 'Volvo', 'Jeep',
            'Tesla', 'Renault', 'Fiat', 'Mitsubishi'
        ]
        all_car_models = []

        for brand_name in car_brands_list:
            brand_logo = self.get_random_file('brands')
            brand, _ = CarBrand.objects.get_or_create(
                name=brand_name,
                defaults={'slug': slugify(brand_name), 'logo': brand_logo}
            )

            # Generate 2-4 random models for this brand
            num_models = random.randint(2, 4)
            for _ in range(num_models):
                # Create a plausible model name (e.g., "Camry", "X5", or a fake one)
                if random.choice([True, False]):
                    model_name = f"{brand_name[:3].upper()}-{random.randint(100, 999)}"
                else:
                    model_name = f"{fake.word().capitalize()} {random.randint(2000, 2025)}"

                model_img = self.get_random_file('car_models')
                c_model, _ = CarModel.objects.get_or_create(
                    brand=brand,
                    name=model_name,
                    defaults={
                        'slug': slugify(f"{brand_name} {model_name}", allow_unicode=True),
                        'image': model_img
                    }
                )
                all_car_models.append(c_model)

        self.stdout.write(f"✅ Created/verified {len(car_brands_list)} car brands with {len(all_car_models)} models")

        # ---------- 3. Create 20 Product Brands ----------
        prod_brands_list = [
            'Bosch', 'ZF', 'Brembo', 'Denso', 'Valeo', 'Delphi', 'ACDelco', 'Magneti Marelli',
            'Hella', 'NGK', 'SKF', 'Mahle', 'Mann-Filter', 'TRW', 'Federal-Mogul', 'Gates',
            'Dayco', 'KYB', 'Monroe', 'Tenneco'
        ]
        product_brands = []
        for b_name in prod_brands_list:
            pb_logo = self.get_random_file('product_brands')
            p_brand, _ = ProductBrand.objects.get_or_create(
                name=b_name,
                defaults={
                    'slug': slugify(b_name),
                    'description': f"Genuine components from {b_name}.",
                    'logo': pb_logo
                }
            )
            product_brands.append(p_brand)
        self.stdout.write(f"✅ Created/verified {len(product_brands)} product brands")

        # ---------- 4. Create 50 Products with thumbnails, gallery images, and compatible cars ----------
        self.stdout.write(self.style.WARNING("Generating 50 products linked with local thumbnails and gallery images..."))

        part_prefixes = ['Heavy Duty', 'Premium', 'Original', 'Performance', 'Eco-Line', 'Racing', 'Pro', 'Ultra']
        part_names = [
            'Brake Pad', 'Oil Filter', 'Spark Plug', 'Shock Absorber', 'Alternator', 'Clutch Kit', 'Timing Belt',
            'Air Filter', 'Fuel Pump', 'Water Pump', 'Ball Joint', 'Tie Rod End', 'Control Arm', 'Radiator',
            'Ignition Coil', 'Oxygen Sensor', 'Starter Motor', 'CV Axle', 'Strut Mount', 'Thermostat'
        ]

        for i in range(50):
            p_name = f"{random.choice(part_prefixes)} {random.choice(part_names)} N-{random.randint(100, 999)}"
            base_price = random.randint(5, 450) * 10000
            has_discount = random.random() < 0.3
            discount_price = base_price - (random.randint(5, 20) * 5000) if has_discount else None

            specs_json = {
                "Weight": f"{random.uniform(0.5, 8.0):.1f} kg",
                "Material": random.choice(["Steel", "Cast Iron", "Ceramic", "Semi-Metallic", "Aluminum", "Composite"]),
                "Warranty": f"{random.choice([6, 12, 24, 36])} Months"
            }

            # Grab a main product thumbnail from media/products/thumbnails/
            prod_thumb = self.get_random_file('products/thumbnails')

            product = Product.objects.create(
                name=p_name,
                slug=slugify(f"{p_name}-{i}"),
                brand=random.choice(product_brands),
                category=random.choice(categories),
                description=fake.paragraph(nb_sentences=4),
                specifications=specs_json,
                price=base_price,
                discount_price=discount_price,
                stock=random.randint(2, 45),
                is_available=True,
                is_hotsale=random.choice([True, False, False, False]),
                thumbnail=prod_thumb
            )

            # Assign 2-4 compatible car models
            compatible_sample = random.sample(all_car_models, random.randint(2, 4))
            product.compatible_cars.set(compatible_sample)

            # Add two gallery images (if available)
            gallery_img_1 = self.get_random_file('products/images')
            gallery_img_2 = self.get_random_file('products/images')
            if gallery_img_1:
                ProductImage.objects.create(product=product, image=gallery_img_1, is_main=False)
            if gallery_img_2:
                ProductImage.objects.create(product=product, image=gallery_img_2, is_main=False)

        self.stdout.write(self.style.SUCCESS(
            "Successfully seeded database with 20 categories, 20 car brands (with models), "
            "20 product brands, and 50 products using high-resolution native image pairs! 🎉"
        ))