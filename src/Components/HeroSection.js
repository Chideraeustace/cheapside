// src/Components/HeroSection.js
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const HeroSection = ({
  isLoading,
  sliderImages = [],
  currentSlideIndex,
  setCurrentSlideIndex,
  heroRef,
  y, // Parallax scroll value from parent
  handleNavClick,
}) => {
  // Auto-slide every 6 seconds
  useEffect(() => {
    if (!setCurrentSlideIndex || sliderImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % sliderImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [sliderImages.length, setCurrentSlideIndex]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
    );
  };

  return (
    <motion.section
      id="hero-section"
      ref={heroRef}
      className="relative w-full h-[85vh] md:h-screen overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        {isLoading || sliderImages.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-zinc-950">
            <div className="animate-spin h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              className="relative w-full h-full flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {/* 1. Blurred "Ambient" Background: Fills the screen edges */}
              <img
                src={sliderImages[currentSlideIndex]?.url}
                alt="Background Blur"
                className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 opacity-30"
              />

              {/* 2. The Main "Full" Image: Uses object-contain to ensure NO cropping */}
              <motion.img
                src={sliderImages[currentSlideIndex]?.url}
                alt={sliderImages[currentSlideIndex]?.alt || "Hero Display"}
                className="relative z-10 w-full h-full object-contain md:p-10"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ y }} // Parallax movement
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* --- OVERLAY LAYER --- */}
      {/* Darkens the bottom area to make white text pop */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* --- CONTENT LAYER --- */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 backdrop-blur-md"
          >
            <span className="text-indigo-400 text-xs md:text-sm font-bold tracking-widest uppercase">
              New Season Arrival
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter uppercase"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Quality You <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
              Can Trust
            </span>
          </motion.h1>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={(e) => handleNavClick(e, "product-container")}
              className="bg-white text-black hover:bg-indigo-600 hover:text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Shop Collection
            </button>
            <button
              onClick={(e) => handleNavClick(e, "categories-section")}
              className="bg-transparent border border-white/40 hover:border-white text-white px-10 py-4 rounded-full font-bold text-lg backdrop-blur-sm transition-all"
            >
              Explore Categories
            </button>
          </motion.div>
        </div>
      </div>

      {/* --- UI NAVIGATION CONTROLS --- */}
      {sliderImages.length > 1 && (
        <>
          {/* Desktop Side Arrows */}
          <div className="hidden lg:block">
            <button
              onClick={prevSlide}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all shadow-2xl"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all shadow-2xl"
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Indicators & Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full z-30">
            {/* Visual Timer Bar */}

            <div className="flex justify-between items-center px-6 md:px-12 py-6 bg-gradient-to-t from-black/50 to-transparent">
              <div className="flex gap-3">
                {sliderImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-1 transition-all duration-500 rounded-full ${
                      idx === currentSlideIndex
                        ? "w-12 bg-white"
                        : "w-6 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <div className="text-white/40 font-mono text-sm tracking-tighter">
                <span className="text-white font-bold">
                  0{currentSlideIndex + 1}
                </span>{" "}
                / 0{sliderImages.length}
              </div>
            </div>
          </div>
        </>
      )}
    </motion.section>
  );
};

export default HeroSection;
