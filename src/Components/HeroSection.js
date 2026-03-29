import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HeroSection = ({
  isLoading,
  sliderImages,
  currentSlideIndex,
  setCurrentSlideIndex,
  heroRef,
  y,
  handleNavClick,
}) => {
  const heroImageVariants = {
    initial: { scale: 1.1, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 1, ease: 'easeOut' } },
  };

  // Automatic slide transition
  useEffect(() => {
    if (sliderImages.length <= 1) return; // No auto-slide if 0 or 1 image

    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % sliderImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [sliderImages.length, setCurrentSlideIndex]);

  return (
    <motion.section
      id="hero-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full h-[70vh] md:h-screen"
      ref={heroRef}
    >
      <div className="relative w-full h-full overflow-hidden rounded-xl">
        {isLoading || sliderImages.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg className="w-12 h-12 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <motion.img
            key={currentSlideIndex}
            src={sliderImages[currentSlideIndex]?.url || ''}
            alt={sliderImages[currentSlideIndex]?.alt || 'Product Image'}
            className="w-full h-full object-contain"
            variants={heroImageVariants}
            initial="initial"
            animate="animate"
            style={{ y }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex items-center justify-center md:justify-start md:items-end md:pb-12 md:pl-12">
          <div className="text-center md:text-left max-w-md">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight font-[Inter, sans-serif]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            >
              Trendy Collections. Quality & Class
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-gray-200 mb-6 max-w-md mx-auto md:mx-0 font-[Inter, sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
            >
              Deals in different types of unisex wears, corporate wears, African wears, dressing belts, 2 & 3 pcs wears, beaded accessories, shirts, crop tops & tubes, perfumes, bags, etc.
            </motion.p>
            <motion.div
              className="flex flex-row items-center md:items-start justify-center md:justify-start space-x-4 pt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
            >
              <motion.a
                href="#product-container"
                className="inline-block bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300 text-base"
                onClick={(e) => handleNavClick(e, 'product-container')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Shop Now"
              >
                Shop Now
              </motion.a>
              <motion.a
                href="#new-arrivals-section"
                className="inline-block bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-indigo-600 transition-colors duration-300 text-base"
                onClick={(e) => handleNavClick(e, 'new-arrivals-section')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View New Arrivals"
              >
                New Arrivals
              </motion.a>
            </motion.div>
          </div>
        </div>
        {sliderImages.length > 1 && (
          <>
            <motion.button
              onClick={() => setCurrentSlideIndex(prev => (prev - 1 + sliderImages.length) % sliderImages.length)}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous slide"
            >
              <FaChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => setCurrentSlideIndex(prev => (prev + 1) % sliderImages.length)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next slide"
            >
              <FaChevronRight className="w-5 h-5" />
            </motion.button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {sliderImages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSlideIndex ? 'bg-white' : 'bg-gray-400 hover:bg-gray-300'}`}
                  whileHover={{ scale: 1.2 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default HeroSection;