// Home.jsx – with imported background image
import React, { useState, useEffect } from "react";
import HeroBanner from "./HeroBanner";
import HotSale from "./HotSale";
import BrandSlider from "./BrandSlider";
import ProductBrandSection from "./ProductBrandSection";
import CategorySection from "../Category/CategorySection";
import SideBySideBanner from "./SideBySideBanner";
import ConsultationBanner from "./ConsultationBanner";
import Abilities from "./Abilities";
import { productAPI } from "../../services/api";
import Loader from "../Common/Loader/Loader";

import bgImage from "/public/bg.webp";

function Home() {
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const response = await productAPI.getHomepageData();
        setHomeData(response.data);
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  if (loading) return <Loader />;

  const {
    categories = [],
    carBrands = [],
    productBrands = [],
    hotSaleProducts = [],
    productsByCategory = {},
  } = homeData;

  // Background style using imported image
  const backgroundStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  return (
    <div className="min-h-screen w-full relative" style={backgroundStyle}>
      <div className="absolute inset-0 bg-white/92 pointer-events-none" />

      <div className="relative z-10">
        <HeroBanner />
        <BrandSlider brands={carBrands} />
        <ProductBrandSection productBrands={productBrands} />
        <HotSale products={hotSaleProducts} />
        {categories.map((category) => {
          const products = productsByCategory[category.id] || [];
          return (
            <CategorySection
              key={category.id}
              title={category.name}
              categorySlug={category.slug}
              products={products}
              slider={true}
            />
          );
        })}
        <SideBySideBanner />
        <ConsultationBanner />
        <Abilities />
      </div>
    </div>
  );
}

export default Home;
