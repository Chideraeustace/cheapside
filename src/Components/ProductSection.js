import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductSection = ({ newArrivals, trendingProducts, productData, searchQuery, selectedTag, hasResults }) => {
  const productCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const renderProductCard = (product, sectionId, index) => (
    <motion.div
      key={product.id}
      className="bg-white p-4 rounded-xl shadow-md cursor-pointer transition-shadow duration-300 hover:shadow-lg snap-center min-w-[160px] md:min-w-0"
      variants={productCardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/product/${product.id}`} state={{ product, sectionId }} aria-label={`View ${product.name}`}>
        <img src={product.image} alt={product.name} className="w-full h-32 object-contain bg-gray-100 rounded-lg mb-2" loading="lazy" />
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 font-[Inter, sans-serif]">{product.name}</h3>
        <p className="text-gray-500 text-xs mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold text-indigo-600">GHS {(product.discount ? product.price * (1 - product.discount) : product.price).toFixed(2)}</span>
            {product.discount && (
              <span className="text-xs text-gray-500 line-through">GHS {product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
        {product.tags && product.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.tags.map(tag => (
              <span key={tag} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );

  return (
    <div id="product-container">
      <motion.section
        id="new-arrivals-section"
        className="py-12 md:py-16 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-[Inter, sans-serif]">New Arrivals</h2>
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 snap-x snap-mandatory scrollbar-hide">
          {newArrivals
            .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedTag === 'all' || (product.tags && product.tags.includes(selectedTag))))
            .map((product, index) => renderProductCard(product, 'new-arrivals-section', index))}
        </div>
      </motion.section>

      <motion.section
        id="trending-section"
        className="py-12 md:py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-[Inter, sans-serif]">Trending Now</h2>
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 snap-x snap-mandatory scrollbar-hide">
          {trendingProducts
            .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedTag === 'all' || (product.tags && product.tags.includes(selectedTag))))
            .map((product, index) => renderProductCard(product, 'trending-section', index))}
        </div>
      </motion.section>

      {!hasResults && (
        <motion.div
          className="text-center text-red-500 font-semibold p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No products found matching your search.
        </motion.div>
      )}
      {Object.entries(productData).map(([category, data]) => {
        if (category === 'hairs') {
          const categoryProducts = data.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedTag === 'all' || (p.tags && p.tags.includes(selectedTag))));
          return (
            <motion.section
              key={category}
              id={`${category}-section`}
              className="py-12 md:py-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-[Inter, sans-serif]">
                Exciting Products
              </h2>
              {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryProducts.map((product, index) =>
                    renderProductCard(product, `${category}-section`, index),
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8">
                  <p className="text-lg">
                    No products available at the moment. More exciting products
                    are coming soon — stay tuned!
                  </p>
                </div>
              )}
            </motion.section>
          );
        } else if (category === 'unisex collection') {
          const categoryProducts = data.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedTag === 'all' || (p.tags && p.tags.includes(selectedTag))));
          if (categoryProducts.length > 0) {
            return (
              <motion.section
                key={category}
                id={`${category.replace(/\s+/g, '-')}-section`}
                className="py-12 md:py-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-[Inter, sans-serif]">Unisex Collection</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryProducts.map((product, index) => renderProductCard(product, `${category.replace(/\s+/g, '-')}-section`, index))}
                </div>
              </motion.section>
            );
          }
        } else {
          return Object.entries(data).map(([subCategory, products]) => {
            const categoryProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedTag === 'all' || (p.tags && p.tags.includes(selectedTag))));
            if (categoryProducts.length > 0) {
              return (
                <motion.section
                  key={`${category}-${subCategory}`}
                  id={`${category.replace(/\s+/g, '-')}-${subCategory.replace(/\s+/g, '-')}-section`}
                  className="py-12 md:py-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-[Inter, sans-serif]">
                    {category === 'men collection' ? 'Men Collection' : 'Women Collection'} -{' '}
                    {subCategory === 'tops & shirts' ? 'Tops & Shirts' :
                     subCategory === 'bottoms' ? 'Bottoms' :
                     subCategory === 'underwears' ? 'Underwears' :
                     subCategory === 'jewelry & accessories' ? 'Jewelry & Accessories' :
                     subCategory === 'slides & footwears' ? 'Slides & Footwears' :
                     subCategory === 'corporate/office wears' ? 'Corporate/Office Wears' :
                     subCategory === 'dresses and 2/3 set pieces' ? 'Dresses & 2/3 Set Pieces' :
                     subCategory === 'african wears' ? 'African Wears' :
                     subCategory === 'blouses and tank tops' ? 'Blouses & Tank Tops' :
                     subCategory === 'belts jewelry and accessories' ? 'Belts, Jewelry & Accessories' :
                     subCategory === 'bags and shoes' ? 'Bags & Shoes' :
                     'Sunglasses & Perfumes'}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryProducts.map((product, index) => renderProductCard(product, `${category.replace(/\s+/g, '-')}-${subCategory.replace(/\s+/g, '-')}-section`, index))}
                  </div>
                </motion.section>
              );
            }
            return null;
          });
        }
        return null;
      })}
    </div>
  );
};

export default ProductSection;