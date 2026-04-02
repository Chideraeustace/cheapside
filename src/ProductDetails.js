import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaMinus,
  FaShoppingBag,
} from "react-icons/fa";
import { CartContext } from "./index";

const ProductDetail = () => {
  const context = useContext(CartContext);
  const { handleAddToCart, getDiscountedPrice } = context || {};
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  // Initialize selectedVariant with the first variant/image if available
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setSelectedVariant(product.images[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-xl text-gray-400 font-medium mb-6">
            Product not found.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white py-3 px-8 rounded-xl font-bold"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCartClick = () => {
    // 1. Create a version of the product that uses the selected variant's image
    const cartProduct = {
      ...product,
      image: selectedVariant ? selectedVariant.url : product.image,
      selectedVariantLabel: selectedVariant?.label || "", // if your data has labels like 'Red' or 'XL'
    };

    // 2. Add to cart using the updated object
    handleAddToCart(cartProduct, quantity);
    navigate("/");
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const displayImage = selectedVariant?.url || product.image;

  return (
    <motion.div
      className="container mx-auto px-4 py-10 max-w-6xl min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center space-x-3 text-sm font-medium text-gray-400">
        <button onClick={() => navigate("/")} className="hover:text-indigo-600">
          Home
        </button>
        <span>/</span>
        <span className="text-indigo-600 font-bold">{product.category}</span>
        <span>/</span>
        <span className="truncate max-w-[150px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Product Image & Variants */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={displayImage}
                src={displayImage}
                alt={product.name}
                className="w-full h-full object-contain p-10 mix-blend-multiply"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>

          {/* Variant Thumbnails */}
          {product.images && product.images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {product.images.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVariant(variant)}
                  className={`w-20 h-20 rounded-2xl border-2 transition-all overflow-hidden bg-white p-1 ${
                    selectedVariant?.url === variant.url
                      ? "border-indigo-600 scale-105 shadow-md"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img
                    src={variant.url}
                    className="w-full h-full object-cover rounded-xl"
                    alt="variant"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-indigo-600 font-black text-3xl">
              GHS {getDiscountedPrice(product).toFixed(2)}
            </div>
          </div>

          <p className="text-gray-500 text-lg leading-relaxed">
            {product.description}
          </p>

          <div className="pt-6 border-t border-gray-100 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              {/* Quantity */}
              <div className="w-full sm:w-auto">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                  Quantity
                </label>
                <div className="flex items-center bg-white border-2 border-gray-100 rounded-2xl p-1">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-indigo-600"
                  >
                    <FaMinus />
                  </button>
                  <span className="w-10 text-center font-black">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-indigo-600"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <motion.button
                onClick={handleAddToCartClick}
                className="flex-1 w-full bg-gray-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShoppingBag /> Add to Cart
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
