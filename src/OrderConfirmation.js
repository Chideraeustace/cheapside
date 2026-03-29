import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { FaShoppingCart, FaHome, FaPhone } from 'react-icons/fa';
import logo from './stephlogo.png';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const { transactionRef, cartItems, totalAmount, customer } = state || {};

  // Animation variants for page load
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Animation for buttons
  const buttonVariants = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  };

  // Fallback if state is not provided
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 font-sans">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 font-[Inter, sans-serif]">
            No Order Information Available
          </h2>
          <p className="mt-4 text-gray-600">
            It seems there was an issue retrieving your order details.
          </p>
          <motion.div
            className="mt-6"
            variants={buttonVariants}
            whileHover="whileHover"
            whileTap="whileTap"
          >
            <Link
              to="/"
              className="inline-flex items-center bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              <FaHome className="w-5 h-5 mr-2" />
              Return to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <header className="bg-black shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <motion.a
            href="/"
            className="text-2xl font-bold text-white tracking-tight"
            variants={buttonVariants}
            whileHover="whileHover"
            whileTap="whileTap"
          >
            <img src={logo} alt="Stephanie Collections Logo" className="h-16 w-auto" />
          </motion.a>
          <motion.div
            className="flex items-center space-x-4"
            variants={buttonVariants}
            whileHover="whileHover"
            whileTap="whileTap"
          >
            <Link
              to="/"
              className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 flex items-center"
            >
              <FaHome className="w-5 h-5 mr-2" />
              Home
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.section
          initial="initial"
          animate="animate"
          variants={pageVariants}
          className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 font-[Inter, sans-serif]">
            Order Confirmation
          </h1>
          <p className="text-center text-gray-600 mb-4">
            Thank you for your purchase! Your order has been successfully placed.
          </p>
          <p className="text-center text-gray-600 mb-8">
            To check the status of your order, please contact our customer support at{' '}
            <a
              href="tel:+233546332669"
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center justify-center"
              aria-label="Call customer support at +233 546 332 669"
            >
              <FaPhone className="w-4 h-4 mr-2" />
              +233 546 332 669
            </a>{' '}
            or{' '}
            <a
              href="tel:+233570265830"
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center justify-center"
              aria-label="Call customer support at +233 570 265 830"
            >
              <FaPhone className="w-4 h-4 mr-2" />
              +233 570 265 830
            </a>
          </p>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4 font-[Inter, sans-serif]">
              Order Details
            </h2>
            <div className="space-y-4">
              <p>
                <span className="font-medium">Transaction Reference:</span> {transactionRef}
              </p>
              <p>
                <span className="font-medium">Total Amount:</span> GHS {totalAmount.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Customer:</span> {customer.name || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Email:</span> {customer.email}
              </p>
              {customer.location && (
                <p>
                  <span className="font-medium">Location:</span> {customer.location}
                </p>
              )}
              {customer.phone && (
                <p>
                  <span className="font-medium">Phone Number:</span> {customer.phone}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 font-[Inter, sans-serif]">
              Order Items
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor}`}
                  className="flex items-center border-b pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">
                      {item.name}
                      {item.selectedColor && ` (${item.selectedColor})`}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-xs text-gray-500">
                      Price: GHS {(item.discount ? item.price * (1 - item.discount) : item.price).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Subtotal: GHS {((item.discount ? item.price * (1 - item.discount) : item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap">
              <Link
                to="/"
                className="inline-flex items-center bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300"
              >
                <FaShoppingCart className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <motion.footer
        className="bg-black text-gray-300 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Stephanie Collections. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-400">Powered by Acetech</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default OrderConfirmation;