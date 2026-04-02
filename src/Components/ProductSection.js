import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

const getSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const ProductSection = ({ newArrivals, productData, addToCart }) => {
  const navigate = useNavigate(); // 2. Initialize navigate

  const renderProductCard = (product) => {
    const firstImage = product.images?.[0] || { url: product.image };

    // 3. Navigation handler
    const handleProductClick = () => {
      navigate(`/product/${getSlug(product.name)}`, {
        state: { product },
      });
    };

    return (
      <motion.div
        key={product.id}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
        whileHover={{ y: -8, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
        onClick={handleProductClick} // 4. Attach click event
      >
        <div className="relative h-48 md:h-72 bg-gray-50 overflow-hidden">
          <motion.img
            src={firstImage.url}
            alt={product.name}
            className="w-full h-full object-contain p-4 md:p-8 transition-transform duration-500 group-hover:scale-110"
          />
          {product.discount && (
            <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-tighter shadow-lg">
              Sale
            </div>
          )}
        </div>

        <div className="p-4 md:p-6">
          <h3 className="font-bold text-gray-900 text-sm md:text-lg line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-2">
            <span className="text-lg md:text-2xl font-black text-indigo-600">
              GHS {Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* Quick-add variants (prevents propagation so clicking variant doesn't trigger card navigation) */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.slice(0, 3).map((variant, idx) => (
                <motion.div
                  key={idx}
                  className="w-8 h-8 border-2 border-gray-100 rounded-lg overflow-hidden hover:border-indigo-500 transition-all shadow-sm"
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => {
                    e.stopPropagation(); // 5. CRITICAL: Stop navigation when clicking variants
                    addToCart(product, variant);
                  }}
                >
                  <img
                    src={variant.url}
                    className="w-full h-full object-cover"
                    alt="variant"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div id="product-container" className="py-16 bg-gray-50/50">
      {/* New Arrivals */}
      <section id="new-arrivals-section" className="mb-24 px-4 md:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs">
              Fresh Drops
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none">
              New Arrivals
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {newArrivals.map(renderProductCard)}
        </div>
      </section>

      {/* Dynamic Categories */}
      {Object.entries(productData).map(([categoryName, subCategories]) => (
        <section
          key={categoryName}
          className="mb-24 pt-16 border-t border-gray-100"
        >
          <h2 className="text-4xl md:text-8xl font-black text-center mb-20 uppercase italic text-gray-200/50 select-none">
            {categoryName}
          </h2>

          {Object.entries(subCategories).map(([subCategoryName, products]) => (
            <div
              key={subCategoryName}
              id={getSlug(subCategoryName)}
              className="mb-20 scroll-mt-24 px-4 md:px-10"
            >
              <div className="flex items-center gap-6 mb-10">
                <h3 className="text-2xl md:text-4xl font-black uppercase italic">
                  {subCategoryName}
                </h3>
                <div className="h-[3px] flex-grow bg-gray-100 rounded-full" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {products.map(renderProductCard)}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
};

export default ProductSection;
