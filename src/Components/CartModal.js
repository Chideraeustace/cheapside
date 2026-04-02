import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingBag,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

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
    open: { x: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
    closed: {
      x: "100%",
      transition: { type: "spring", damping: 25, stiffness: 200 },
    },
  };

  const isGuestDetailsValid = user
    ? true
    : guestDetails.email &&
      guestDetails.name &&
      guestDetails.location &&
      guestDetails.phone &&
      /^\S+@\S+\.\S+$/.test(guestDetails.email) &&
      /^\+?\d{10,15}$/.test(guestDetails.phone);

  const isCheckoutDisabled =
    isCheckoutLoading ||
    cartItems.length === 0 ||
    (!user && !isGuestDetailsValid);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Side Panel */}
          <motion.div
            variants={cartModalVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute inset-y-0 right-0 w-full max-w-md bg-gray-50 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-white border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaShoppingBag className="text-indigo-600" /> Your Cart
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {totalItems} items selected
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaShoppingBag className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Looks like you haven't added anything yet.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 text-indigo-600 font-semibold hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        layout
                        key={`${item.id}-${item.selectedColor}`}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4"
                      >
                        <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          {item.selectedColor && (
                            <p className="text-xs text-gray-400 mb-1">
                              Color: {item.selectedColor}
                            </p>
                          )}
                          <p className="text-indigo-600 font-bold text-sm">
                            GHS{" "}
                            {(item.discount
                              ? item.price * (1 - item.discount)
                              : item.price
                            ).toFixed(2)}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => handleQuantityChange(item, -1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-600"
                              >
                                <FaMinus className="w-2.5 h-2.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item, 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-600"
                              >
                                <FaPlus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item)}
                              className="text-gray-300 hover:text-red-500 transition-colors p-2"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Guest Checkout Form */}
                  {!user && (
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        Delivery Details
                      </h3>

                      <div className="space-y-3">
                        <InputField
                          icon={<FaUser />}
                          label="Full Name"
                          type="text"
                          placeholder="John Doe"
                          value={guestDetails.name}
                          onChange={(v) =>
                            setGuestDetails((p) => ({ ...p, name: v }))
                          }
                        />
                        <InputField
                          icon={<FaEnvelope />}
                          label="Email Address"
                          type="email"
                          placeholder="john@example.com"
                          value={guestDetails.email}
                          onChange={(v) =>
                            setGuestDetails((p) => ({ ...p, email: v }))
                          }
                        />
                        <InputField
                          icon={<FaMapMarkerAlt />}
                          label="Delivery Location"
                          type="text"
                          placeholder="House No, Street, City"
                          value={guestDetails.location}
                          onChange={(v) =>
                            setGuestDetails((p) => ({ ...p, location: v }))
                          }
                        />
                        <InputField
                          icon={<FaPhone />}
                          label="Phone Number"
                          type="tel"
                          placeholder="+233..."
                          value={guestDetails.phone}
                          onChange={(v) =>
                            setGuestDetails((p) => ({ ...p, phone: v }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer / Summary - Sticky at bottom */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white border-t space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Subtotal</span>
                    <span>GHS {totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-bold text-lg">
                    <span>Total</span>
                    <span>GHS {totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleClearCart}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    disabled={isCheckoutLoading}
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckoutDisabled}
                    className={`flex-[2] py-3 px-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200
                      ${isCheckoutDisabled ? "bg-gray-300 cursor-not-allowed shadow-none" : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"}`}
                  >
                    {isCheckoutLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Checkout Now"
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Helper Component for Form Inputs
const InputField = ({ icon, label, type, placeholder, value, onChange }) => (
  <div className="relative group">
    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">
      {label}
    </label>
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
        {React.cloneElement(icon, { className: "w-3.5 h-3.5" })}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
        required
      />
    </div>
  </div>
);

export default CartModal;
