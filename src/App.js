// src/App.js
import React, { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";
import { auth, firestore } from "./Firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import { CartContext } from "./index";
import logo from "./assets/image-removebg-preview (13).png";

import Header from "./Components/Header";
import HeroSection from "./Components/HeroSection";
import CategorySection from "./Components/CategorySection";
import SearchSection from "./Components/SearchSection";
import ProductSection from "./Components/ProductSection";
import Footer from "./Components/Footer";
import CartModal from "./Components/CartModal";
import { FaArrowUp, FaWhatsapp } from "react-icons/fa";

const App = () => {
  const { cartItems, setCartItems } = useContext(CartContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [productData, setProductData] = useState({}); // Dynamic grouping
  const [newArrivals, setNewArrivals] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ← Dynamic categories
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    email: "",
    name: "",
    location: "",
    phone: "",
  });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [toast, setToast] = useState(null);

  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);

  // Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // Scroll & loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch Categories + Products Dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Categories
        const catSnapshot = await getDocs(
          collection(firestore, "cs-categories"),
        );
        const fetchedCategories = catSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(fetchedCategories);

        // 2. Fetch Products
        const prodSnapshot = await getDocs(
          collection(firestore, "cs-products"),
        );
        let allProducts = prodSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Normalize products (support both old `image` and new `images` array)
        allProducts = allProducts.map((product) => ({
          ...product,
          images:
            product.images &&
            Array.isArray(product.images) &&
            product.images.length > 0
              ? product.images
              : product.image
                ? [{ url: product.image, color: "Default" }]
                : [],
          image: product.images?.[0]?.url || product.image || null,
        }));

        // Group products dynamically by category → subcategory
        const groupedData = {};

        allProducts.forEach((product) => {
          const catName = product.category || "Uncategorized";
          if (!groupedData[catName]) groupedData[catName] = {};

          const subCatName = product.subCategory || "Others";
          if (!groupedData[catName][subCatName]) {
            groupedData[catName][subCatName] = [];
          }
          groupedData[catName][subCatName].push(product);
        });

        // New Arrivals & Trending
        const arrivals = allProducts.filter((p) =>
          p.tags?.some((tag) => tag.toLowerCase() === "new arrivals"),
        );
        const trending = allProducts.filter((p) =>
          p.tags?.some((tag) => tag.toLowerCase() === "trending now"),
        );

        setProductData(groupedData);
        setNewArrivals(arrivals);
        setTrendingProducts(trending);

        // Hero Slider - Use first image of trending + arrivals
        const sliderProducts = [
          ...trending.slice(0, 3),
          ...arrivals.slice(0, 2),
        ];
        const slides = sliderProducts.map((p) => ({
          url: p.images?.[0]?.url || p.image || logo,
          alt: p.name || "Product",
        }));

        setSliderImages([{ url: logo, alt: "Logo" }, ...slides]);
        setProductsLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProductsLoaded(true);
      }
    };

    fetchData();
  }, []);

  // Add to Cart with selected variant
  const addToCart = (product, selectedVariant) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      selectedColor: selectedVariant.color || "Default",
      selectedImage: selectedVariant.url,
      images: product.images || [],
    };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === cartItem.id &&
          item.selectedColor === cartItem.selectedColor,
      );

      if (existingIndex !== -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, cartItem];
    });

    setToast({
      message: `${product.name} (${selectedVariant.color}) added to cart!`,
      type: "success",
    });
  };

  // Cart handlers
  const handleQuantityChange = (item, delta) => {
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === item.id && cartItem.selectedColor === item.selectedColor
          ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + delta) }
          : cartItem,
      ),
    );
  };

  const handleRemoveItem = (item) => {
    setCartItems((prev) =>
      prev.filter(
        (cartItem) =>
          !(
            cartItem.id === item.id &&
            cartItem.selectedColor === item.selectedColor
          ),
      ),
    );
  };

  // Add this inside the App component, before the return ()
  const handleNavClick = (e, targetId) => {
    if (e) e.preventDefault();

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // If you have a mobile menu open, close it here
      setIsMobileMenuOpen(false);
    } else {
      console.error(`Could not find element with ID: ${targetId}`);
    }
  };

  const handleClearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Checkout (kept your original logic)
  const handleCheckout = async () => {
    if (!cartItems.length) {
      setToast({ message: "Your cart is empty.", type: "error" });
      return;
    }

    const { email, name, location, phone } = guestDetails;
    if (!user && (!email || !name || !location || !phone)) {
      setToast({
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    setIsCheckoutLoading(true);

    try {
      const payload = {
        amount: totalAmount,
        email: user ? user.email : email,
        name: user ? user.displayName || name : name,
        phone: user ? user.phone || phone : phone,
        location: user ? user.location || location : location,
        cartItems: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image, 
          quantity: item.quantity,
          price: item.discount ? item.price * (1 - item.discount) : item.price,
          selectedColor: item.selectedColor,
        })),
      };

      const response = await fetch(
        "https://us-central1-login-60ced.cloudfunctions.net/createMoolreCheckout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.checkoutUrl) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Moolre
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      setToast({
        message: error.message || "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (!productsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="text-gray-800 min-h-screen font-sans">
      <Header
        logo={logo}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        totalItems={totalItems}
        categories={categories}
        user={user}
        handleNavClick={handleNavClick}
      />

      <CartModal
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        handleQuantityChange={handleQuantityChange}
        handleRemoveItem={handleRemoveItem}
        handleClearCart={handleClearCart}
        handleCheckout={handleCheckout}
        isCheckoutLoading={isCheckoutLoading}
        guestDetails={guestDetails}
        setGuestDetails={setGuestDetails}
        user={user}
        totalItems={totalItems}
        totalAmount={totalAmount}
      />

      <main>
        <HeroSection
          isLoading={isLoading}
          sliderImages={sliderImages}
          currentSlideIndex={currentSlideIndex}
          setCurrentSlideIndex={setCurrentSlideIndex}
          heroRef={heroRef}
          y={y}
        />

        <CategorySection
          categories={categories}
          // This flattens your grouped productData back into a single array for searching
          products={Object.values(productData).flatMap((cat) =>
            Object.values(cat).flat(),
          )}
          handleNavClick={handleNavClick} // Ensure this function is passed if you want clicking to work
        />

        {searchQuery && (
          <SearchSection
            searchQuery={searchQuery}
            filteredProducts={Object.values(productData).flatMap((cat) =>
              Object.values(cat).flat(),
            )}
            addToCart={addToCart}
          />
        )}

        <ProductSection
          productData={productData} // ← Dynamic
          newArrivals={newArrivals}
          trendingProducts={trendingProducts}
          addToCart={addToCart}
        />
      </main>

      <Footer handleNavClick={handleNavClick} />

      {/* Back to Top & WhatsApp */}
      {showBackToTop && (
        <>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaArrowUp className="w-5 h-5" />
          </motion.button>

          <motion.a
            href="https://wa.me/233558861119"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-20 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaWhatsapp className="w-5 h-5" />
          </motion.a>
        </>
      )}
    </div>
  );
};;

export default App;
