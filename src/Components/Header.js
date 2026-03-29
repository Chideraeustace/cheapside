import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = ({
  logo,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  isMenDropdownOpen,
  setIsMenDropdownOpen,
  isWomenDropdownOpen,
  setIsWomenDropdownOpen,
  isCartOpen,
  setIsCartOpen,
  totalItems,
  user,
  handleNavClick,
  handleLogout,
  navSections,
  menSubcategories,
  womenSubcategories,
}) => {
  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    closed: { opacity: 0, y: '-100%', transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const dropdownVariants = {
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const formatSubSectionName = (subSection) => {
    // Ensure robust prefix and suffix removal
    let subCategory = subSection
      .replace(/^men-collection-/, '')
      .replace(/^women-collection-/, '')
      .replace(/-section$/, '');
    
    // Handle special case for corporate/office-wears
    subCategory = subCategory.replace('corporate/office-wears', 'corporate-office-wears');
    subCategory = subCategory.replace('dresses-and-2/3-set-pieces', 'dresses-and-2-3-set-pieces');

    let formattedName;
    switch (subCategory) {
      // Men's subcategories
      case 'tops-&-shirts':
        formattedName = 'Tops & Shirts';
        break;
      case 'bottoms':
        formattedName = 'Bottoms';
        break;
      case 'underwears':
        formattedName = 'Underwears';
        break;
      case 'jewelry-&-accessories':
        formattedName = 'Jewelry & Accessories';
        break;
      case 'slides-&-footwears':
        formattedName = 'Slides & Footwears';
        break;
      case 'corporate-office-wears':
        formattedName = 'Corporate/Office Wears';
        break;
      // Women's subcategories
      case 'dresses-and-2-3-set-pieces':
        formattedName = 'Dresses & 2/3 Set Pieces';
        break;
      case 'blouses-and-tank-tops':
        formattedName = 'Blouses & Tank Tops';
        break;
      case 'belts-jewelry-and-accessories':
        formattedName = 'Belts, Jewelry & Accessories';
        break;
      case 'bags-and-shoes':
        formattedName = 'Bags & Shoes';
        break;
      case 'sunglasses-and-perfumes':
        formattedName = 'Sunglasses & Perfumes';
        break;
      case 'african-wears':
        formattedName = 'African Wears';
        break;
      default:
        console.warn(`Unmatched subcategory: ${subSection} (processed as ${subCategory})`);
        formattedName = subCategory
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        break;
    }
    return formattedName;
  };

  return (
    <header className="bg-black shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between">
        <motion.a
          href="#hero-section"
          className="text-2xl font-bold text-white tracking-tight"
          onClick={(e) => handleNavClick(e, 'hero-section')}
          whileHover={{ scale: 1.05 }}
          aria-label="Stephanie Collections Home"
        >
          <img src={logo} alt="Stephanie Collections Logo" className="h-16 w-auto" />
        </motion.a>
        <div className="flex-1 flex justify-end items-center space-x-4">
          <div className="hidden md:flex relative w-full max-w-xs lg:max-w-sm">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-300" aria-label="Search">
              <FaSearch className="w-5 h-5" />
            </button>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-gray-300 font-medium">
            {navSections.map(section => (
              <div key={section} className="relative">
                {section === 'men-collection-section' || section === 'women-collection-section' ? (
                  <>
                    <motion.button
                      className="hover:text-indigo-400 transition-colors text-sm tracking-wide flex items-center"
                      onClick={() => {
                        if (section === 'men-collection-section') {
                          setIsMenDropdownOpen(!isMenDropdownOpen);
                          setIsWomenDropdownOpen(false);
                        } else {
                          setIsWomenDropdownOpen(!isWomenDropdownOpen);
                          setIsMenDropdownOpen(false);
                        }
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={section === 'men-collection-section' ? 'Men Collection Menu' : 'Women Collection Menu'}
                      aria-expanded={section === 'men-collection-section' ? isMenDropdownOpen : isWomenDropdownOpen}
                    >
                      {section === 'men-collection-section' ? 'Men Collection' : 'Women Collection'}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.button>
                    <AnimatePresence>
                      {(section === 'men-collection-section' && isMenDropdownOpen) || (section === 'women-collection-section' && isWomenDropdownOpen) ? (
                        <motion.div
                          variants={dropdownVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="absolute left-0 mt-2 w-48 bg-black shadow-lg rounded-lg z-[55] overflow-hidden"
                        >
                          {(section === 'men-collection-section' ? menSubcategories : womenSubcategories).map(subSection => (
                            <motion.a
                              key={subSection}
                              href={`#${subSection}`}
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-indigo-400 transition-colors"
                              onClick={(e) => {
                                handleNavClick(e, subSection);
                                setIsMenDropdownOpen(false);
                                setIsWomenDropdownOpen(false);
                              }}
                              whileHover={{ scale: 1.05 }}
                              aria-label={`Navigate to ${formatSubSectionName(subSection)}`}
                            >
                              {formatSubSectionName(subSection)}
                            </motion.a>
                          ))}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.a
                    href={`#${section}`}
                    className="hover:text-indigo-400 transition-colors text-sm tracking-wide"
                    onClick={(e) => handleNavClick(e, section)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Navigate to ${section.split('-')[0].replace(/^\w/, c => c.toUpperCase())}`}
                  >
                    {section === 'hero-section' ? 'Home' :
                     section === 'categories-section' ? 'Categories' :
                     section === 'new-arrivals-section' ? 'New Arrivals' :
                     section === 'trending-section' ? 'Trending Now' :
                     section === 'unisex-collection-section' ? 'Unisex Collection' :
                     section === 'hairs-section' ? 'Hairs' :
                     section.split('-')[0].charAt(0).toUpperCase() + section.split('-')[0].slice(1)}
                  </motion.a>
                )}
              </div>
            ))}
            {user && (
              <>
                <motion.a
                  href="/dashboard"
                  className="hover:text-indigo-400 transition-colors text-sm tracking-wide"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Go to Dashboard"
                >
                  Dashboard
                </motion.a>
                <motion.button
                  onClick={handleLogout}
                  className="hover:text-indigo-400 transition-colors text-sm tracking-wide"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Log out"
                >
                  Logout
                </motion.button>
              </>
            )}
            <motion.button
              onClick={() => {
                setIsCartOpen(!isCartOpen);
                setIsMobileMenuOpen(false);
                setIsSearchOpen(false);
              }}
              className="relative text-gray-300 hover:text-indigo-400 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View cart"
            >
              <FaShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {totalItems}
                </span>
              )}
            </motion.button>
          </nav>
        </div>
        <div className="flex items-center space-x-3 md:hidden">
          <motion.button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setIsMobileMenuOpen(false);
            }}
            className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle search"
          >
            <FaSearch className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => {
              setIsCartOpen(!isCartOpen);
              setIsMobileMenuOpen(false);
              setIsSearchOpen(false);
            }}
            className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View cart"
          >
            <FaShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {totalItems}
              </span>
            )}
          </motion.button>
          <motion.button
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              setIsSearchOpen(false);
              setIsCartOpen(false);
            }}
            className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <FaBars className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden px-4 py-2 bg-black shadow-lg sticky-search"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-300" aria-label="Search">
                <FaSearch className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden absolute w-full bg-black shadow-lg p-4 z-[55]"
          >
            <div className="flex flex-col space-y-4 text-gray-300 font-medium">
              {navSections.map(section => (
                <div key={section}>
                  {section === 'men-collection-section' || section === 'women-collection-section' ? (
                    <>
                      <motion.button
                        className="w-full text-left py-2 px-4 hover:bg-gray-800 rounded-lg text-sm tracking-wide flex items-center"
                        onClick={() => {
                          if (section === 'men-collection-section') {
                            setIsMenDropdownOpen(!isMenDropdownOpen);
                            setIsWomenDropdownOpen(false);
                          } else {
                            setIsWomenDropdownOpen(!isWomenDropdownOpen);
                            setIsMenDropdownOpen(false);
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={section === 'men-collection-section' ? 'Men Collection Menu' : 'Women Collection Menu'}
                        aria-expanded={section === 'men-collection-section' ? isMenDropdownOpen : isWomenDropdownOpen}
                      >
                        {section === 'men-collection-section' ? 'Men Collection' : 'Women Collection'}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.button>
                      <AnimatePresence>
                        {(section === 'men-collection-section' && isMenDropdownOpen) || (section === 'women-collection-section' && isWomenDropdownOpen) ? (
                          <motion.div
                            variants={dropdownVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="pl-4 space-y-2"
                          >
                            {(section === 'men-collection-section' ? menSubcategories : womenSubcategories).map(subSection => (
                              <motion.a
                                key={subSection}
                                href={`#${subSection}`}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-indigo-400 transition-colors"
                                onClick={(e) => {
                                  handleNavClick(e, subSection);
                                  setIsMenDropdownOpen(false);
                                  setIsWomenDropdownOpen(false);
                                  setIsMobileMenuOpen(false);
                                }}
                                whileHover={{ scale: 1.05 }}
                                aria-label={`Navigate to ${formatSubSectionName(subSection)}`}
                              >
                                {formatSubSectionName(subSection)}
                              </motion.a>
                            ))}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </>
                  ) : (
                    <motion.a
                      href={`#${section}`}
                      className="block py-2 px-4 hover:bg-gray-800 rounded-lg text-sm tracking-wide"
                      onClick={(e) => {
                        handleNavClick(e, section);
                        setIsMobileMenuOpen(false);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Navigate to ${section.split('-')[0].replace(/^\w/, c => c.toUpperCase())}`}
                    >
                      {section === 'hero-section' ? 'Home' :
                       section === 'categories-section' ? 'Categories' :
                       section === 'new-arrivals-section' ? 'New Arrivals' :
                       section === 'trending-section' ? 'Trending Now' :
                       section === 'unisex-collection-section' ? 'Unisex Collection' :
                       section === 'hairs-section' ? 'Hairs' :
                       section.split('-')[0].charAt(0).toUpperCase() + section.split('-')[0].slice(1)}
                    </motion.a>
                  )}
                </div>
              ))}
              {user && (
                <>
                  <motion.a
                    href="/dashboard"
                    className="block py-2 px-4 hover:bg-gray-800 rounded-lg text-sm tracking-wide"
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Go to Dashboard"
                  >
                    Dashboard
                  </motion.a>
                  <motion.button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block py-2 px-4 hover:bg-gray-800 rounded-lg text-sm tracking-wide text-left"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Log out"
                  >
                    Logout
                  </motion.button>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;