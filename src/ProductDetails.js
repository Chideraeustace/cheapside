import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar } from 'react-icons/fa';
import { CartContext } from './index';

const ProductDetail = () => {
  const context = useContext(CartContext);
  const { handleAddToCart, getDiscountedPrice } = context || {};
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isImageLoading, setIsImageLoading] = useState(true);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600 font-semibold font-[Inter, sans-serif]">Product not found.</p>
        <motion.button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </motion.button>
      </div>
    );
  }

  if (!handleAddToCart || !getDiscountedPrice) {
    console.error('CartContext is not properly provided.');
    return (
      <div className="container mx-auto px-4 py-12 text-center min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-red-500 font-semibold font-[Inter, sans-serif]">An error occurred. Please try again later.</p>
        <motion.button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </motion.button>
      </div>
    );
  }

  const availableColors = product.colors || [];

  const handleAddToCartClick = () => {
    handleAddToCart(product, quantity);
    navigate('/');
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  // Placeholder for rating (assuming a rating field could be added to product data)
  const rating = 4.5; // Static for now, can be replaced with product.rating
  const maxRating = 5;

  return (
    <motion.div
      className="container mx-auto px-4 py-12 max-w-5xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-600 font-[Inter, sans-serif]">
        <motion.a
          href="/"
          className="hover:text-indigo-600 transition-colors duration-300"
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
          whileHover={{ scale: 1.05 }}
        >
          Home
        </motion.a>
        <span>/</span>
        <span className="text-gray-400">{product.name}</span>
      </nav>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <AnimatePresence>
            {isImageLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg"
              >
                <svg className="w-12 h-12 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-contain bg-gray-100 rounded-lg transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onLoad={() => setIsImageLoading(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-[Inter, sans-serif]">{product.name}</h1>
          
          {/* Price and Discount */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl md:text-3xl font-bold text-indigo-600">GHS {getDiscountedPrice(product).toFixed(2)}</span>
            {product.discount && (
              <span className="text-lg text-gray-500 line-through">GHS {product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            {[...Array(maxRating)].map((_, index) => (
              <FaStar
                key={index}
                className={index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
                size={20}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">({rating})</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed">{product.description}</p>

          {/* Color Selector */}
          

          {/* Quantity Selector */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700">Quantity:</label>
            <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-2 w-fit">
              <motion.button
                onClick={() => handleQuantityChange(-1)}
                className="bg-white text-gray-700 px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-200 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                -
              </motion.button>
              <span className="text-base font-medium w-10 text-center">{quantity}</span>
              <motion.button
                onClick={() => handleQuantityChange(1)}
                className="bg-white text-gray-700 px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-200 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                +
              </motion.button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCartClick}
            className={`w-full md:w-auto bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300 text-base disabled:bg-gray-400 disabled:cursor-not-allowed`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={availableColors.length > 0 && !selectedColor}
          >
            Add to Cart
          </motion.button>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <motion.button
        onClick={() => navigate('/')}
        className="mt-8 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold font-[Inter, sans-serif]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="mr-2" /> Back to Products
      </motion.button>
    </motion.div>
  );
};

export default ProductDetail;