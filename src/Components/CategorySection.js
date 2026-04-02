import React from "react";
import { motion } from "framer-motion";

const CategorySection = ({ categories, products, handleNavClick }) => {
  const getSubcategoryImage = (subName) => {
    if (!products || !subName) return null;

    /**
     * 1. IMPROVED NORMALIZE:
     * We keep letters and numbers, but strip symbols and extra spaces.
     * This ensures "2/3 Set Pieces" becomes "dresses23setpieces" consistently.
     */
    const normalize = (str) =>
      str
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "") // Keeps alphanumeric, removes slashes, ampersands, spaces
        .trim();

    const normalizedSubName = normalize(subName);

    // 2. Find matching product
    const matchingProduct = products.find((p) => {
      const normalizedProdSub = normalize(p.subCategory);
      const normalizedProdCat = normalize(p.category);
      return (
        normalizedProdSub === normalizedSubName ||
        normalizedProdCat === normalizedSubName
      );
    });

    if (matchingProduct) {
      if (matchingProduct.images?.length > 0)
        return matchingProduct.images[0].url;
      if (matchingProduct.image) return matchingProduct.image;
    }

    // 3. High-quality generic fallback
    return `https://images.unsplash.com/photo-1445205170230-053b830c6039?q=80&w=200&h=200&auto=format&fit=crop`;
  };

  return (
    <motion.section
      id="categories-section"
      className="py-24 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-indigo-600 font-bold tracking-[0.3em] uppercase text-xs mb-3"
          >
            Curated Selection
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase italic">
            Shop By Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-zinc-50 rounded-[3rem] p-8 md:p-12 border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="flex items-end justify-between mb-12 border-b border-zinc-200 pb-6">
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase leading-none">
                    {category.name}
                  </h3>
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-3">
                    {category.subCategories?.length || 0} Specialized Segments
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
                {category.subCategories?.map((subName, i) => {
                  const subImg = getSubcategoryImage(subName);

                  /**
                   * NAVIGATION LOGIC:
                   * This generates a ID that matches the headers in your ProductSection.
                   * Example: "Tops & Shirts" -> "tops-shirts"
                   */
                  const targetId = subName
                    .toLowerCase()
                    .replace(/&/g, "") // Remove ampersand
                    .replace(/\//g, "-") // Replace slash with dash
                    .replace(/\s+/g, "-") // Replace spaces with dash
                    .replace(/-+/g, "-") // Remove double dashes
                    .trim();

                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center cursor-pointer group/sub"
                      onClick={(e) => handleNavClick(e, targetId)}
                    >
                      <div className="relative w-20 h-20 md:w-28 md:h-28 mb-4">
                        <div className="absolute inset-0 rounded-full bg-indigo-600 opacity-0 group-hover/sub:opacity-10 group-hover/sub:scale-125 transition-all duration-500" />
                        <div className="w-full h-full rounded-full overflow-hidden border-[6px] border-white shadow-xl relative z-10 bg-zinc-200">
                          <img
                            src={subImg}
                            alt={subName}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/sub:scale-115"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200";
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] md:text-[11px] font-black text-center text-zinc-500 group-hover/sub:text-indigo-600 transition-colors uppercase tracking-tight leading-tight px-2">
                        {subName}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CategorySection;
