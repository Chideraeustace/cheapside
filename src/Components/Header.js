import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaSearch,
  FaShoppingCart,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";

// Standardized ID generator
const getSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const Header = ({
  logo,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  searchQuery,
  setSearchQuery,
  isCartOpen,
  setIsCartOpen,
  totalItems,
  handleNavClick = () => {},
  categories = [],
}) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleMobileCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <header className="bg-black shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.a
          href="#hero-section"
          onClick={(e) => handleNavClick(e, "hero-section")}
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <img src={logo} alt="Logo" className="h-12 md:h-14 w-auto" />
        </motion.a>

        {/* --- Desktop Navigation --- */}
        <nav className="hidden md:flex items-center gap-8 text-gray-300 font-medium">
          <button
            onClick={(e) => handleNavClick(e, "hero-section")}
            className="hover:text-white transition-colors"
          >
            Home
          </button>

          {categories.map((category) => (
            <div key={category.id} className="relative group py-2">
              <button className="hover:text-white transition-colors flex items-center gap-1 outline-none">
                {category.name}
                <FaChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </button>

              <div className="absolute left-0 mt-2 w-56 bg-zinc-900 rounded-xl shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-zinc-800">
                {category.subCategories?.map((sub, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleNavClick(e, getSlug(sub))}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={(e) => handleNavClick(e, "new-arrivals-section")}
            className="hover:text-white transition-colors"
          >
            New Arrivals
          </button>
        </nav>

        {/* --- Right Side Tools --- */}
        <div className="flex items-center gap-5">
          <div className="hidden md:block relative w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 py-2 rounded-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative text-gray-300 hover:text-white p-2"
          >
            <FaShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-gray-300 p-2"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Drawer --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-screen w-4/5 max-w-sm bg-zinc-950 z-[70] p-6 md:hidden overflow-y-auto"
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="float-right text-gray-400 mb-6"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="flex flex-col space-y-4 text-gray-300 mt-12">
                <button
                  onClick={(e) => {
                    handleNavClick(e, "hero-section");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-3 text-lg border-b border-zinc-900"
                >
                  Home
                </button>

                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">
                    Categories
                  </p>
                  {categories.map((category) => (
                    <div key={category.id} className="mb-2">
                      <button
                        onClick={() => toggleMobileCategory(category.id)}
                        className="flex justify-between items-center w-full py-3 text-white"
                      >
                        {category.name}
                        <FaChevronDown
                          className={`w-4 h-4 transition-transform ${expandedCategory === category.id ? "rotate-180" : ""}`}
                        />
                      </button>
                      {expandedCategory === category.id && (
                        <div className="pl-4 flex flex-col bg-zinc-900/50 rounded-lg">
                          {category.subCategories?.map((sub, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                handleNavClick(e, getSlug(sub));
                                setIsMobileMenuOpen(false);
                              }}
                              className="text-left text-gray-400 py-3 text-base"
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    handleNavClick(e, "new-arrivals-section");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-3 text-lg border-t border-zinc-900"
                >
                  New Arrivals
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
