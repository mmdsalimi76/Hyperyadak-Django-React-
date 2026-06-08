// CategorySection.jsx – now uses the shared ProductCard component
import React from "react";
import { Link } from "react-router-dom";
import ProductSlider from "../Home/ProductSlider";
import ProductCard from "../Common/Card/ProductCard";

function CategorySection({
  title,
  categorySlug,
  viewAllLink,
  products,
  slider = false,
}) {
  const allLink = categorySlug ? `/categories/${categorySlug}` : viewAllLink;

  if (slider) {
    return (
      <ProductSlider products={products} title={title} viewAllLink={allLink} />
    );
  }

  // Grid mode – use ProductCard for each product
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        {allLink && (
          <Link
            to={allLink}
            className="text-sky-600 font-semibold hover:underline"
          >
            مشاهده همه
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const normalizedProduct = {
            ...product,
            image:
              product.thumbnail_url ||
              (product.images && product.images.length > 0
                ? product.images[0].image
                : "/placeholder.png"),
          };
          return <ProductCard key={product.id} product={normalizedProduct} />;
        })}
      </div>
    </section>
  );
}

export default CategorySection;
