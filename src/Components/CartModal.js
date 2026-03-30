import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash } from 'react-icons/fa';

const CartModal = ({
  isCartOpen,
  setIsCartOpen,
  cartItems,
  handleQuantityChange,
  handleRemoveItem,
  handleClearCart,
  handleCheckout,
  isCheckoutLoading,
  guestDetails,
  setGuestDetails,
  user,
  totalItems,
  totalAmount,
}) => {
  const cartModalVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut', staggerChildren: 0.1 } },
    closed: { opacity: 0, x: '100%', transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const cartItemVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  // Validate guest details
  const isGuestDetailsValid = user
    ? true
    : guestDetails.email &&
      guestDetails.name &&
      guestDetails.location &&
      guestDetails.phone &&
      /^\S+@\S+\.\S+$/.test(guestDetails.email) && // Basic email validation
      /^\+?\d{10,15}$/.test(guestDetails.phone); // Phone: 10-15 digits, optional +

  // Determine if checkout button should be disabled
  const isCheckoutDisabled = isCheckoutLoading || cartItems.length === 0 || (!user && !isGuestDetailsValid);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex justify-end"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            variants={cartModalVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="bg-white w-full max-w-md h-full p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-[Inter, sans-serif]">
                Your Cart
              </h2>
              <motion.button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-600 hover:text-gray-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close cart"
              >
                <FaTimes className="w-6 h-6" />
              </motion.button>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty.</p>
            ) : (
              <>
                <motion.div className="space-y-4" variants={cartModalVariants}>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.selectedColor}`}
                      className="flex items-center border-b pb-4"
                      variants={cartItemVariants}
                      transition={{ delay: index * 0.1 }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-lg mr-4"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold">
                          {item.name}
                          {item.selectedColor && ` (${item.selectedColor})`}
                        </h3>
                        <p className="text-xs text-gray-500">
                          GHS{" "}
                          {(item.discount
                            ? item.price * (1 - item.discount)
                            : item.price
                          ).toFixed(2)}
                        </p>
                        <div className="flex items-center mt-2">
                          <motion.button
                            onClick={() => handleQuantityChange(item, -1)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            -
                          </motion.button>
                          <span className="mx-2 text-sm">{item.quantity}</span>
                          <motion.button
                            onClick={() => handleQuantityChange(item, 1)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </motion.button>
                          <motion.button
                            onClick={() => handleRemoveItem(item)}
                            className="ml-4 text-red-500 hover:text-red-700"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <FaTrash className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                <div className="mt-6">
                  {!user && (
                    <div className="space-y-4 mb-4">
                      <div>
                        <label
                          htmlFor="guestEmail"
                          className="block text-sm font-semibold mb-2"
                        >
                          Email (required)
                        </label>
                        <input
                          id="guestEmail"
                          type="email"
                          placeholder="Enter your email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={guestDetails.email}
                          onChange={(e) =>
                            setGuestDetails((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          aria-label="Guest email for checkout"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="guestName"
                          className="block text-sm font-semibold mb-2"
                        >
                          Name (required)
                        </label>
                        <input
                          id="guestName"
                          type="text"
                          placeholder="Enter your name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={guestDetails.name}
                          onChange={(e) =>
                            setGuestDetails((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          aria-label="Guest name for checkout"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="guestLocation"
                          className="block text-sm font-semibold mb-2"
                        >
                          Location (required)
                        </label>
                        <input
                          id="guestLocation"
                          type="text"
                          placeholder="Enter your location"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={guestDetails.location}
                          onChange={(e) =>
                            setGuestDetails((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          aria-label="Guest location for checkout"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="guestPhone"
                          className="block text-sm font-semibold mb-2"
                        >
                          Phone Number (required)
                        </label>
                        <input
                          id="guestPhone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={guestDetails.phone}
                          onChange={(e) =>
                            setGuestDetails((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          aria-label="Guest phone number for checkout"
                          required
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-lg font-semibold">
                    Total Items: {totalItems}
                  </p>
                  <p className="text-lg font-semibold">
                    Total: GHS {totalAmount.toFixed(2)}
                  </p>
                  <div className="flex space-x-4 mt-4">
                    <motion.button
                      onClick={handleClearCart}
                      className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isCheckoutLoading}
                      aria-label="Clear cart"
                    >
                      Clear Cart
                    </motion.button>
                    <motion.button
                      onClick={handleCheckout} // ← Keep this simple
                      className={`bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center ${
                        isCheckoutDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      whileHover={{ scale: isCheckoutDisabled ? 1 : 1.05 }}
                      whileTap={{ scale: isCheckoutDisabled ? 1 : 0.95 }}
                      disabled={isCheckoutDisabled}
                      aria-label="Proceed to checkout with Moolre"
                    >
                      {isCheckoutLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Checkout with Moolre" // Optional: clearer text
                      )}
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;