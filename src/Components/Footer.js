import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { SiTiktok, SiSnapchat, SiTelegram } from 'react-icons/si';

const Footer = ({
  handleNavClick,
  isMenDropdownOpen,
  setIsMenDropdownOpen,
  isWomenDropdownOpen,
  setIsWomenDropdownOpen,
  menSubcategories,
  womenSubcategories,
}) => {
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
    
    // Handle special cases for corporate/office-wears and dresses-and-2/3-set-pieces
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
    <motion.footer
      className="bg-black text-gray-300 py-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-white text-xl font-bold font-[Inter, sans-serif]">
            CheapSide
          </h3>
          <p className="text-sm leading-relaxed">
            Affordable items, quality you can trust. Discover Cheapside's
            curated collections and get more value for your money.
          </p>
          <div className="flex space-x-4">
            {[
              {
                icon: FaInstagram,
                href: "https://www.instagram.com/stephnice_collection?igsh=MWNja3JzNHFlZW9qOA==",
                label: "Instagram",
              },
              {
                icon: FaFacebookF,
                href: "https://www.facebook.com/share/1B2xccB8Me/?mibextid=wwXIfr",
                label: "Facebook",
              },
              {
                icon: SiTiktok,
                href: "https://www.tiktok.com/@stephnicecollection?_t=ZM-8zBcgpfodcM&_r=1",
                label: "TikTok",
              },
              {
                icon: SiSnapchat,
                href: "https://www.snapchat.com/add/stephnice_colec",
                label: "Snapchat",
              },
              {
                icon: SiTelegram,
                href: "https://t.me/stephnicecollection",
                label: "Telegram",
              },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="text-gray-300 hover:text-indigo-400 transition-colors duration-300"
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Visit our ${social.label}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 font-[Inter, sans-serif]">
            Shop
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <motion.a
                href="#unisex-collection-section"
                className="hover:text-indigo-400 transition-colors duration-300"
                onClick={(e) => handleNavClick(e, "unisex-collection-section")}
                whileHover={{ scale: 1.05 }}
                aria-label="Navigate to Unisex Collection"
              >
                Unisex Collection
              </motion.a>
            </li>
            <li>
              <motion.button
                className="hover:text-indigo-400 transition-colors duration-300 flex items-center"
                onClick={() => {
                  setIsMenDropdownOpen(!isMenDropdownOpen);
                  setIsWomenDropdownOpen(false);
                }}
                whileHover={{ scale: 1.05 }}
                aria-label="Men Collection Menu"
                aria-expanded={isMenDropdownOpen}
              >
                Men Collection
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.button>
              <AnimatePresence>
                {isMenDropdownOpen && (
                  <motion.ul
                    variants={dropdownVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="pl-4 space-y-2"
                  >
                    {menSubcategories.map((subSection) => (
                      <li key={subSection}>
                        <motion.a
                          href={`#${subSection}`}
                          className="hover:text-indigo-400 transition-colors duration-300"
                          onClick={(e) => {
                            handleNavClick(e, subSection);
                            setIsMenDropdownOpen(false);
                          }}
                          whileHover={{ scale: 1.05 }}
                          aria-label={`Navigate to ${formatSubSectionName(subSection)}`}
                        >
                          {formatSubSectionName(subSection)}
                        </motion.a>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
            <li>
              <motion.button
                className="hover:text-indigo-400 transition-colors duration-300 flex items-center"
                onClick={() => {
                  setIsWomenDropdownOpen(!isWomenDropdownOpen);
                  setIsMenDropdownOpen(false);
                }}
                whileHover={{ scale: 1.05 }}
                aria-label="Women Collection Menu"
                aria-expanded={isWomenDropdownOpen}
              >
                Women Collection
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.button>
              <AnimatePresence>
                {isWomenDropdownOpen && (
                  <motion.ul
                    variants={dropdownVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="pl-4 space-y-2"
                  >
                    {womenSubcategories.map((subSection) => (
                      <li key={subSection}>
                        <motion.a
                          href={`#${subSection}`}
                          className="hover:text-indigo-400 transition-colors duration-300"
                          onClick={(e) => {
                            handleNavClick(e, subSection);
                            setIsWomenDropdownOpen(false);
                          }}
                          whileHover={{ scale: 1.05 }}
                          aria-label={`Navigate to ${formatSubSectionName(subSection)}`}
                        >
                          {formatSubSectionName(subSection)}
                        </motion.a>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 font-[Inter, sans-serif]">
            Support
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <FaEnvelope className="w-4 h-4 text-indigo-400" />
              <a
                href="mailto:ebortey25@gmail.com"
                className="hover:text-indigo-400 transition-colors duration-300"
                aria-label="Email Customer Support"
              >
                CustomerSupport@gmail.com
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaPhone className="w-4 h-4 text-indigo-400" />
              <a
                href="tel:+233546332669"
                className="hover:text-indigo-400 transition-colors duration-300"
                aria-label="Call Customer Support"
              >
                +233 549 856 098 / +233 558 861 119
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaMapMarkerAlt className="w-4 h-4 text-indigo-400" />
              <span>Kumasi, Ashanti-Ghana</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-700 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} CheapSide. All rights
          reserved.
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Powered by{" "}
          <a
            href="https://wa.me/233559370174"
            className="hover:text-indigo-400 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acement
          </a>
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;