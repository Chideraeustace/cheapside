import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import { auth, firestore } from './Firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import { CartContext } from './index';
import logo from './assets/image-removebg-preview (13).png';
import image1 from './assets/men.jpeg';
import image2 from './assets/image2.jpeg';
import image3 from './assets/trousers.jpeg';
import image4 from './assets/jewellry.jpeg';
import image6 from './assets/footwears.jpeg';
import image7 from './assets/office.jpeg';
import image8 from './assets/bag.jpeg';
import image9 from './assets/african.jpeg';
import image10 from './assets/perfumes.jpeg';
import image11 from './assets/tank.jpeg';
import image12 from './assets/womanjewelry.jpeg';
import image13 from './assets/women.jpeg';
import image14 from './assets/2 set.jpeg';
import image15 from './assets/unisex.jpeg';
import Header from './Components/Header';
import HeroSection from './Components/HeroSection';
import CategorySection from './Components/CategorySection';
import SearchSection from './Components/SearchSection';
import ProductSection from './Components/ProductSection';
import Footer from './Components/Footer';
import CartModal from './Components/CartModal';
import { FaArrowUp, FaWhatsapp } from 'react-icons/fa';

// Placeholder images for categories
const categoryImages = {
  unisex: image15,
  men: {
    main: image1,
    topsShirts: image2,
    bottoms: image3,
    jewelryAccessories: image4,
    slidesFootwears: image6,
  },
  women: {
    main: image13,
    corporateOfficeWears: image7,
    dressesAndSets: image14,
    africanWears: image9,
    blousesAndTankTops: image11,
    beltsJewelryAndAccessories: image12,
    bagsAndShoes: image8,
    sunglassesAndPerfumes: image10,
  },
};

const App = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenDropdownOpen, setIsMenDropdownOpen] = useState(false);
  const [isWomenDropdownOpen, setIsWomenDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [productData, setProductData] = useState({});
  const [newArrivals, setNewArrivals] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    email: "",
    name: "",
    location: "",
    phone: "",
  });
  const [selectedTag] = useState("all");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [toast, setToast] = useState(null); // ← CORRECT
  //const navigate = useNavigate();
  const heroRef = useRef(null);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "cs-products"),
        );
        const allProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const groupedData = {
          "unisex collection": [],
          "men collection": {},
          "women collection": {},
          hairs: [],
        };

        allProducts.forEach((product) => {
          if (!product.image || typeof product.image !== "string") {
            console.warn(
              `Product ${product.id} has invalid image field:`,
              product.image,
            );
            return;
          }
          if (product.category === "unisex collection") {
            groupedData["unisex collection"].push(product);
          } else if (product.category === "hairs") {
            groupedData.hairs.push(product);
          } else if (product.category === "men collection") {
            if (!groupedData["men collection"][product.subCategory])
              groupedData["men collection"][product.subCategory] = [];
            groupedData["men collection"][product.subCategory].push(product);
          } else if (product.category === "women collection") {
            if (!groupedData["women collection"][product.subCategory])
              groupedData["women collection"][product.subCategory] = [];
            groupedData["women collection"][product.subCategory].push(product);
          }
        });

        const arrivals = allProducts.filter(
          (p) =>
            p.tags &&
            p.tags.some((tag) => tag.toLowerCase() === "new arrivals"),
        );
        const trending = allProducts.filter(
          (p) =>
            p.tags &&
            p.tags.some((tag) => tag.toLowerCase() === "trending now"),
        );

        console.log("All Products:", allProducts);
        console.log("Trending Products:", trending);
        console.log("New Arrivals:", arrivals);

        setProductData(groupedData);
        setNewArrivals(arrivals);
        setTrendingProducts(trending);

        const selectedProducts = [];
        const validProducts = allProducts.filter(
          (p) => p.image && typeof p.image === "string",
        );

        for (let i = 0; i < Math.min(trending.length, 2); i++) {
          if (trending[i].image) {
            selectedProducts.push(trending[i]);
          }
        }

        for (
          let i = 0;
          i < Math.min(arrivals.length, 2) && selectedProducts.length < 5;
          i++
        ) {
          if (
            arrivals[i].image &&
            !selectedProducts.some((p) => p.id === arrivals[i].id)
          ) {
            selectedProducts.push(arrivals[i]);
          }
        }

        const remainingSlots = 5 - selectedProducts.length;
        if (remainingSlots > 0 && validProducts.length > 0) {
          const availableProducts = validProducts.filter(
            (p) => !selectedProducts.some((sp) => sp.id === p.id),
          );
          for (
            let i = 0;
            i < Math.min(remainingSlots, availableProducts.length);
            i++
          ) {
            const randomIndex = Math.floor(
              Math.random() * availableProducts.length,
            );
            selectedProducts.push(availableProducts[randomIndex]);
            availableProducts.splice(randomIndex, 1);
          }
        }

        let allSlides = selectedProducts
          .map((p) => ({
            url: p.image,
            alt: p.name || "Product Image",
          }))
          .filter((slide) => slide.url);

        while (allSlides.length < 5) {
          allSlides.push({
            url: "./assets/image-removebg-preview (13).png",
            alt: "Default Product Image",
          });
        }

        console.log("Selected Products:", selectedProducts);
        console.log("All Slides:", allSlides);

        const logoSlide = {
          url: logo,
          alt: "Website Logo",
        };
        setSliderImages([logoSlide, ...allSlides]);

        allSlides.forEach((slide, index) => {
          const img = new Image();
          img.src = slide.url;
          img.onload = () =>
            console.log(
              `Slide ${index + 1} image loaded successfully: ${slide.url}`,
            );
          img.onerror = () =>
            console.error(
              `Failed to load slide ${index + 1} image: ${slide.url}`,
            );
        });

        setProductsLoaded(true);
      } catch (error) {
        console.error("Error fetching products:", error);
        setSliderImages([
          {
            url: logo,
            alt: "Website Logo",
          },
          ...Array(5).fill({
            url: "./assets/image-removebg-preview (13).png",
            alt: "Default Product Image",
          }),
        ]);
        setProductsLoaded(true);
      }
    };

    fetchProducts();
  }, []);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsMenDropdownOpen(false);
    setIsWomenDropdownOpen(false);
    setIsCartOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: "smooth",
      });
    } else {
      console.warn(`Section with ID ${sectionId} not found`);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  const handleQuantityChange = (item, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.id === item.id && cartItem.selectedColor === item.selectedColor
          ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + delta) }
          : cartItem,
      ),
    );
  };

  const handleRemoveItem = (item) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (cartItem) =>
          !(
            cartItem.id === item.id &&
            cartItem.selectedColor === item.selectedColor
          ),
      ),
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // In your main component (App.js, etc.)
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
          quantity: item.quantity,
          price: item.discount ? item.price * (1 - item.discount) : item.price,
          selectedColor: item.selectedColor,
        })),
      };

      const response = await fetch(
        "https://us-central1-eustech-c4332.cloudfunctions.net/createMoolreCheckout",
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
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.discount ? item.price * (1 - item.discount) : item.price) *
        item.quantity,
    0,
  );

  const filteredProducts = Object.entries(productData).flatMap(
    ([category, data]) => {
      if (category === "unisex collection" || category === "hairs") {
        return data.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedTag === "all" || (p.tags && p.tags.includes(selectedTag))),
        );
      }
      return Object.values(data)
        .flat()
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedTag === "all" || (p.tags && p.tags.includes(selectedTag))),
        );
    },
  );

  const hasResults = filteredProducts.length > 0 || searchQuery === "";

  const navSections = [
    "hero-section",
    "categories-section",
    "new-arrivals-section",
    "trending-section",
  ];

  const menSubcategories = [
    "tops & shirts",
    "bottoms",
    "jewelry & accessories",
  ].map((sub) => `men-collection-${sub.replace(/\s+/g, "-")}-section`);

  const womenSubcategories = [
    "corporate/office wears",
    "dresses and 2/3 set pieces",
    "african wears",
    "blouses and tank tops",
    "belts jewelry and accessories",
    "bags and shoes",
    "sunglasses and perfumes",
  ].map((sub) => `women-collection-${sub.replace(/\s+/g, "-")}-section`);

  const SkeletonProductCard = () => (
    <div className="bg-white p-4 rounded-xl shadow-md min-w-[160px] md:min-w-0 animate-pulse">
      <div className="w-full h-32 bg-gray-200 rounded-lg mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-1"></div>
      <div className="h-3 bg-gray-200 rounded mb-2"></div>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );

  if (!productsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {[...Array(8)].map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-800 min-h-screen font-sans">
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .sticky-search {
            position: sticky;
            top: 80px;
            z-index: 40;
            background: black;
            padding: 8px 16px;
          }
          .category-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f3f4f6;
          }
          .category-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>

      <Header
        logo={logo}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMenDropdownOpen={isMenDropdownOpen}
        setIsMenDropdownOpen={setIsMenDropdownOpen}
        isWomenDropdownOpen={isWomenDropdownOpen}
        setIsWomenDropdownOpen={setIsWomenDropdownOpen}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        totalItems={totalItems}
        user={user}
        handleNavClick={handleNavClick}
        handleLogout={handleLogout}
        navSections={navSections}
        menSubcategories={menSubcategories}
        womenSubcategories={womenSubcategories}
      />

      <CartModal
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        handleQuantityChange={handleQuantityChange}
        handleRemoveItem={handleRemoveItem}
        handleClearCart={handleClearCart}
        handleCheckout={handleCheckout} // ← This is fine now
        isCheckoutLoading={isCheckoutLoading}
        guestDetails={guestDetails}
        setGuestDetails={setGuestDetails}
        user={user}
        totalItems={totalItems}
        totalAmount={totalAmount}
        // No need to pass setToast anymore since handleCheckout already has access to it
      />

      <main className="container mx-auto px-0 py-0 md:py-0">
        <HeroSection
          isLoading={isLoading}
          sliderImages={sliderImages}
          currentSlideIndex={currentSlideIndex}
          setCurrentSlideIndex={setCurrentSlideIndex}
          heroRef={heroRef}
          y={y}
          handleNavClick={handleNavClick}
        />

        <CategorySection
          categoryImages={categoryImages}
          handleNavClick={handleNavClick}
        />

        {searchQuery && hasResults && (
          <SearchSection
            searchQuery={searchQuery}
            filteredProducts={filteredProducts}
          />
        )}

        <ProductSection
          newArrivals={newArrivals}
          trendingProducts={trendingProducts}
          productData={productData}
          searchQuery={searchQuery}
          selectedTag={selectedTag}
          hasResults={hasResults}
        />
      </main>

      <Footer
        handleNavClick={handleNavClick}
        isMenDropdownOpen={isMenDropdownOpen}
        setIsMenDropdownOpen={setIsMenDropdownOpen}
        isWomenDropdownOpen={isWomenDropdownOpen}
        setIsWomenDropdownOpen={setIsWomenDropdownOpen}
        menSubcategories={menSubcategories}
        womenSubcategories={womenSubcategories}
      />

      {showBackToTop && (
        <>
          <motion.button
            onClick={handleScrollToTop}
            className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            aria-label="Scroll to top"
          >
            <FaArrowUp className="w-5 h-5" />
          </motion.button>
          <motion.a
            href="https://wa.me/233558861119"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-20 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            aria-label="Contact via WhatsApp"
          >
            <FaWhatsapp className="w-5 h-5" />
          </motion.a>
        </>
      )}
    </div>
  );
};;

export default App;