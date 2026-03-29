import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SearchSection = ({ searchQuery, filteredProducts }) => {
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
    <motion.section
      id="search-results-section"
      className="py-12 md:py-16 bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-[Inter, sans-serif]">
        Search Results for "{searchQuery}"
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product, index) => renderProductCard(product, 'search-results-section', index))}
      </div>
    </motion.section>
  );
};

export default SearchSection;