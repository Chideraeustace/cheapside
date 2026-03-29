import React from 'react';
import { motion } from 'framer-motion';

const CategorySection = ({ categoryImages, handleNavClick }) => {
  const categoryCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Define subcategories to match App.jsx, Header.jsx, Footer.jsx, and ProductSection.jsx
  const menSubcategories = [
    'tops & shirts',
    'bottoms',
    'underwears',
    'jewelry & accessories',
    'slides & footwears',
  ].map(sub => ({
    id: `men-collection-${sub.replace(/\s+/g, '-')}-section`,
    name: sub,
    imageKey: sub === 'tops & shirts' ? 'topsShirts' :
              sub === 'jewelry & accessories' ? 'jewelryAccessories' :
              sub === 'slides & footwears' ? 'slidesFootwears' : sub,
  }));

  const womenSubcategories = [
    'corporate/office wears',
    'dresses and 2/3 set pieces',
    'african wears',
    'blouses and tank tops',
    'belts jewelry and accessories',
    'bags and shoes',
    'sunglasses and perfumes',
  ].map(sub => ({
    id: `women-collection-${sub.replace(/\s+/g, '-')}-section`,
    name: sub,
    imageKey: sub === 'corporate/office wears' ? 'corporateOfficeWears' :
              sub === 'dresses and 2/3 set pieces' ? 'dressesAndSets' :
              sub === 'african wears' ? 'africanWears' :
              sub === 'blouses and tank tops' ? 'blousesAndTankTops' :
              sub === 'belts jewelry and accessories' ? 'beltsJewelryAndAccessories' :
              sub === 'bags and shoes' ? 'bagsAndShoes' : 'sunglassesAndPerfumes',
  }));

  const formatSubCategoryName = (subCategory) => {
    return subCategory === 'tops & shirts' ? 'Tops & Shirts' :
           subCategory === 'bottoms' ? 'Bottoms' :
           subCategory === 'underwears' ? 'Underwears' :
           subCategory === 'jewelry & accessories' ? 'Jewelry & Accessories' :
           subCategory === 'slides & footwears' ? 'Slides & Footwears' :
           subCategory === 'corporate/office wears' ? 'Corporate/Office Wears' :
           subCategory === 'dresses and 2/3 set pieces' ? 'Dresses & 2/3 Set Pieces' : // Fixed from 'dresses and sets'
           subCategory === 'african wears' ? 'African Wears' :
           subCategory === 'blouses and tank tops' ? 'Blouses & Tank Tops' :
           subCategory === 'belts jewelry and accessories' ? 'Belts, Jewelry & Accessories' :
           subCategory === 'bags and shoes' ? 'Bags & Shoes' :
           'Sunglasses & Perfumes';
  };

  return (
    <motion.section
      id="categories-section"
      className="py-12 md:py-16 bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-[Inter, sans-serif]">
        Explore Our Categories
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
        <motion.div
          className="flex flex-col items-center"
          variants={categoryCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.a
            href="#unisex-collection-section"
            onClick={(e) => handleNavClick(e, 'unisex-collection-section')}
            className="category-circle"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Navigate to Unisex Collection"
          >
            <img src={categoryImages.unisex} alt="Unisex Collection" className="w-full h-full object-contain" />
          </motion.a>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Unisex Collection</h3>
        </motion.div>
        <motion.div
          className="flex flex-col items-center"
          variants={categoryCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <motion.a
            href="#men-collection-section"
            onClick={(e) => handleNavClick(e, 'men-collection-section')}
            className="category-circle"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Navigate to Men Collection"
          >
            <img src={categoryImages.men.main} alt="Men Collection" className="w-full h-full object-contain" />
          </motion.a>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Men Collection</h3>
        </motion.div>
        {menSubcategories.map((subCategory, index) => (
          <motion.div
            key={subCategory.id}
            className="flex flex-col items-center"
            variants={categoryCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <motion.a
              href={`#${subCategory.id}`}
              onClick={(e) => handleNavClick(e, subCategory.id)}
              className="category-circle"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Navigate to Men ${formatSubCategoryName(subCategory.name)}`}
            >
              <img src={categoryImages.men[subCategory.imageKey]} alt={`Men ${formatSubCategoryName(subCategory.name)}`} className="w-full h-full object-contain" />
            </motion.a>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">{formatSubCategoryName(subCategory.name)}</h3>
          </motion.div>
        ))}
        <motion.div
          className="flex flex-col items-center"
          variants={categoryCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          <motion.a
            href="#women-collection-section"
            onClick={(e) => handleNavClick(e, 'women-collection-section')}
            className="category-circle"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Navigate to Women Collection"
          >
            <img src={categoryImages.women.main} alt="Women Collection" className="w-full h-full object-contain" />
          </motion.a>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Women Collection</h3>
        </motion.div>
        {womenSubcategories.map((subCategory, index) => (
          <motion.div
            key={subCategory.id}
            className="flex flex-col items-center"
            variants={categoryCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.8 + index * 0.1 }}
          >
            <motion.a
              href={`#${subCategory.id}`}
              onClick={(e) => handleNavClick(e, subCategory.id)}
              className="category-circle"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Navigate to Women ${formatSubCategoryName(subCategory.name)}`}
            >
              <img src={categoryImages.women[subCategory.imageKey]} alt={`Women ${formatSubCategoryName(subCategory.name)}`} className="w-full h-full object-contain" />
            </motion.a>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">{formatSubCategoryName(subCategory.name)}</h3>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default CategorySection;