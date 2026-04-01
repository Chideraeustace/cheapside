import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "./Firebaseconfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaShoppingCart, FaSearch, FaFilter } from "react-icons/fa";

const Dashboard = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productColors, setProductColors] = useState("");
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productError, setProductError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [dailyEarnings, setDailyEarnings] = useState(0);

  // New states for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubCategory, setFilterSubCategory] = useState("");

  const navigate = useNavigate();

  // Define subcategories
  const menSubcategories = [
    "tops & shirts",
    "bottoms",
    "underwears",
    "jewelry & accessories",
    "slides & footwears",
  ];

  const womenSubcategories = [
    "corporate/office wears",
    "dresses and 2/3 set pieces",
    "african wears",
    "blouses and tank tops",
    "belts jewelry and accessories",
    "bags and shoes",
    "sunglasses and perfumes",
  ];

  // Fetch orders and products
  useEffect(() => {
    if (!auth.currentUser || auth.currentUser.email !== storeOwnerEmail) {
      return;
    }

    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      setOrderError("");
      try {
        const ordersQuery = query(collection(firestore, "cs-orders"));
        const querySnapshot = await getDocs(ordersQuery);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrderError("Failed to load orders. Please try again.");
      } finally {
        setIsLoadingOrders(false);
      }
    };

    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      setProductError("");
      try {
        const productsQuery = query(collection(firestore, "cs-products"));
        const querySnapshot = await getDocs(productsQuery);
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductError("Failed to load products. Please try again.");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchOrders();
    fetchProducts();
  }, []);

  // Calculate earnings
  useEffect(() => {
    const today = new Date("2025-08-28");
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const confirmedOrders = orders.filter(
      (order) => order.status === "confirmed" && order.totalAmount,
    );

    const total = confirmedOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );
    setTotalEarnings(total);

    const daily = confirmedOrders.reduce((sum, order) => {
      const orderDate = order.createdAt?.toDate
        ? order.createdAt.toDate()
        : null;
      if (orderDate && orderDate >= today && orderDate < tomorrow) {
        return sum + order.totalAmount;
      }
      return sum;
    }, 0);
    setDailyEarnings(daily);
  }, [orders]);

  useEffect(() => {
    if (editingProduct) {
      setEditPrice(editingProduct.price.toString());
      setEditQuantity(editingProduct.quantity.toString());
      setShowModal(true);
    }
  }, [editingProduct]);

  // Restrict access
  const storeOwnerEmail = "chideraeustace99@gmail.com";
  if (!auth.currentUser || auth.currentUser.email !== storeOwnerEmail) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 text-center text-gray-800 font-sans"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Access Denied</h2>
        <p className="text-red-500 mb-4 text-sm md:text-base">
          Only the store owner can access the dashboard.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center mx-auto text-sm md:text-base"
        >
          <FaShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          Back to Store
        </button>
      </motion.div>
    );
  }

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());
    const matchesCategory =
      !filterCategory || product.category === filterCategory;
    const matchesSubCategory =
      !filterSubCategory || product.subCategory === filterSubCategory;

    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const handleUploadProduct = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !productName ||
      !productPrice ||
      !productDescription ||
      !productCategory ||
      !productQuantity
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    if (!productImage || !(productImage instanceof File)) {
      setErrorMessage("Please select a valid image file.");
      return;
    }
    if (
      (productCategory === "men collection" ||
        productCategory === "women collection") &&
      !productSubCategory
    ) {
      setErrorMessage(
        "Please select a subcategory for Men Collection or Women Collection.",
      );
      return;
    }
    if (isNaN(productQuantity) || productQuantity < 0) {
      setErrorMessage("Quantity must be a non-negative number.");
      return;
    }

    setIsUploading(true);
    try {
      const imageRef = ref(storage, `images/${productImage.name}`);
      const snapshot = await uploadBytes(imageRef, productImage);
      const imageUrl = await getDownloadURL(snapshot.ref);

      const tags = [];
      if (isNewArrival) tags.push("new arrivals");
      if (isTrending) tags.push("trending now");

      const colors = productColors
        ? productColors.split(",").map((color) => color.trim())
        : [];

      const docRef = await addDoc(collection(firestore, "cs-products"), {
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        image: imageUrl,
        category: productCategory,
        subCategory: productSubCategory || null,
        quantity: parseInt(productQuantity),
        colors,
        tags,
      });

      setProducts((prev) => [
        ...prev,
        {
          id: docRef.id,
          name: productName,
          price: parseFloat(productPrice),
          description: productDescription,
          image: imageUrl,
          category: productCategory,
          subCategory: productSubCategory || null,
          quantity: parseInt(productQuantity),
          colors,
          tags,
        },
      ]);

      // Reset form
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setProductImage(null);
      setProductCategory("");
      setProductSubCategory("");
      setProductQuantity("");
      setProductColors("");
      setIsNewArrival(false);
      setIsTrending(false);
      setSuccessMessage("Product uploaded successfully!");
    } catch (error) {
      setErrorMessage(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteDoc(doc(firestore, "cs-products", id));
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      setProductError("Failed to delete product. Please try again.");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (
      !editPrice ||
      !editQuantity ||
      isNaN(editPrice) ||
      isNaN(editQuantity) ||
      parseFloat(editPrice) < 0 ||
      parseInt(editQuantity) < 0
    ) {
      alert("Please enter valid price and quantity.");
      return;
    }
    try {
      const productRef = doc(firestore, "cs-products", editingProduct.id);
      await updateDoc(productRef, {
        price: parseFloat(editPrice),
        quantity: parseInt(editQuantity),
      });
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                price: parseFloat(editPrice),
                quantity: parseInt(editQuantity),
              }
            : p,
        ),
      );
      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="container mx-auto px-4 py-8 max-w-4xl text-gray-800 font-sans"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <motion.h2
          variants={childVariants}
          className="text-2xl md:text-3xl font-bold text-center md:text-left font-[Inter, sans-serif]"
        >
          Store Owner Dashboard
        </motion.h2>
        <motion.div
          variants={childVariants}
          className="mt-4 md:mt-0 md:ml-4 flex flex-col items-center md:items-end text-sm md:text-base"
        >
          <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg mb-2">
            Total Earnings: GHS {totalEarnings.toFixed(2)}
          </div>
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
            Today’s Earnings: GHS {dailyEarnings.toFixed(2)}
          </div>
        </motion.div>
      </div>

      <motion.button
        variants={childVariants}
        onClick={() => navigate("/")}
        className="mb-6 bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors duration-300 w-full md:w-auto flex items-center justify-center text-sm md:text-base"
        disabled={isUploading || isLoadingOrders || isLoadingProducts}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
        Back to Store
      </motion.button>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-2 px-4 text-center font-medium text-sm md:text-base ${activeTab === "upload" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
        >
          Upload Product
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`flex-1 py-2 px-4 text-center font-medium text-sm md:text-base ${activeTab === "manage" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
        >
          Manage Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 py-2 px-4 text-center font-medium text-sm md:text-base ${activeTab === "orders" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
        >
          Orders
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "upload" && (
          <motion.section
            key="upload"
            variants={childVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="mb-12"
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4 font-[Inter, sans-serif]">
              Upload New Product
            </h3>
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm md:text-base"
                >
                  {errorMessage}
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-sm md:text-base"
                >
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.form
              onSubmit={handleUploadProduct}
              className="bg-white p-6 rounded-lg shadow-md space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0"
              variants={formVariants}
            >
              <motion.div variants={childVariants} className="space-y-2">
                <label className="block text-gray-700 font-medium text-sm md:text-base">
                  Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow duration-300 text-sm md:text-base"
                  required
                  disabled={isUploading}
                />
              </motion.div>
              <motion.div variants={childVariants} className="space-y-2">
                <label className="block text-gray-700 font-medium text-sm md:text-base">
                  Price (GHS)
                </label>
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow duration-300 text-sm md:text-base"
                  required
                  disabled={isUploading}
                />
              </motion.div>
              <motion.div
                variants={childVariants}
                className="space-y-2 md:col-span-2"
              >
                <label className="block text-gray-700 font-medium text-sm md:text-base">
                  Description
                </label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow duration-300 text-sm md:text-base"
                  required
                  disabled={isUploading}
                  rows={4}
                />
              </motion.div>
              <motion.div variants={childVariants} className="space-y-2">
                <label className="block text-gray-700 font-medium text-sm md:text-base">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProductImage(e.target.files[0])}
                  className="w-full border border-gray-300 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors duration-300"
                  required
                  disabled={isUploading}
                />
              </motion.div>
              <motion.div variants={childVariants} className="space-y-2">
                <label className="block text-gray-700 font-medium text-sm md:text-base">
                  Category
                </label>
                <select
                  value={productCategory}
                  onChange={(e) => {
                    setProductCategory(e.target.value);
                    setProductSubCategory("");
                  }}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow duration-300 text-sm md:text-base"
                  required
                  disabled={isUploading}
                >
                  <option value="">Select Category</option>
                  <option value="unisex collection">Unisex Collection</option>
                  <option value="men collection">Men Collection</option>
                  <option value="women collection">Women Collection</option>
                  <option value="hairs">Hairs</option>
                </select>
              </motion.div>
              {(productCategory === "men collection" ||
                productCategory === "women collection") && (
                <motion.div
                  variants={childVariants}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-gray-700 font-medium text-sm md:text-base">
                    Subcategory
                  </label>
                  <select
                    value={productSubCategory}
                    onChange={(e) => setProductSubCategory(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow duration-300 text-sm md:text-base"
                    required
                    disabled={isUploading}
                  >
                    <option value="">Select Subcategory</option>
                    {productCategory === "men collection" &&
                      menSubcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub.charAt(0).toUpperCase() + sub.slice(1)}
                        </option>
                      ))}
                    {productCategory === "women collection" &&
                      womenSubcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub.charAt(0).toUpperCase() + sub.slice(1)}
                        </option>
                      ))}
                  </select>
                </motion.div>
              )}
              <motion.div variants={childVariants} className="space-y-2">
                <label className="block text-gray-700 font-medium text-sm md:text-base">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow duration-300 text-sm md:text-base"
                  required
                  disabled={isUploading}
                />
              </motion.div>
              <motion.div variants={childVariants} className="space-y-2">
                <label className="block text-gray-700 font-medium text-sm md:text-base">
                  Available Colors (comma-separated, optional)
                </label>
                <input
                  type="text"
                  value={productColors}
                  onChange={(e) => setProductColors(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow duration-300 text-sm md:text-base"
                  placeholder="e.g., Red, Blue, Green"
                  disabled={isUploading}
                />
              </motion.div>
              <motion.div
                variants={childVariants}
                className="flex items-center space-x-4 md:space-x-6"
              >
                <label className="flex items-center cursor-pointer text-sm md:text-base">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="mr-2 form-checkbox text-indigo-600 w-4 h-4 md:w-5 md:h-5"
                    disabled={isUploading}
                  />
                  New Arrivals
                </label>
                <label className="flex items-center cursor-pointer text-sm md:text-base">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="mr-2 form-checkbox text-indigo-600 w-4 h-4 md:w-5 md:h-5"
                    disabled={isUploading}
                  />
                  Trending Now
                </label>
              </motion.div>
              <motion.button
                variants={childVariants}
                type="submit"
                className="bg-indigo-600 text-white py-3 px-6 rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors duration-300 md:col-span-2 w-full md:w-auto justify-self-end flex items-center justify-center text-sm md:text-base"
                disabled={isUploading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload Product"
                )}
              </motion.button>
            </motion.form>
          </motion.section>
        )}

        {activeTab === "manage" && (
          <motion.section
            key="manage"
            variants={childVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-6 font-[Inter, sans-serif]">
              Manage Products
            </h3>

            {/* Search and Filter Bar */}
            <div className="mb-6 bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                  />
                </div>

                <div className="lg:w-64">
                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setFilterSubCategory("");
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-sm"
                  >
                    <option value="">All Categories</option>
                    <option value="unisex collection">Unisex Collection</option>
                    <option value="men collection">Men Collection</option>
                    <option value="women collection">Women Collection</option>
                    <option value="hairs">Hairs</option>
                  </select>
                </div>

                {(filterCategory === "men collection" ||
                  filterCategory === "women collection") && (
                  <div className="lg:w-80">
                    <select
                      value={filterSubCategory}
                      onChange={(e) => setFilterSubCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-sm"
                    >
                      <option value="">All Subcategories</option>
                      {filterCategory === "men collection" &&
                        menSubcategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub.charAt(0).toUpperCase() + sub.slice(1)}
                          </option>
                        ))}
                      {filterCategory === "women collection" &&
                        womenSubcategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub.charAt(0).toUpperCase() + sub.slice(1)}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                <FaFilter className="text-indigo-600" />
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {filteredProducts.length}
                </span>{" "}
                of {products.length} products
              </div>
            </div>

            <AnimatePresence>
              {productError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm md:text-base"
                >
                  {productError}
                </motion.div>
              )}
            </AnimatePresence>

            {isLoadingProducts ? (
              <div className="flex justify-center items-center py-12">
                <svg
                  className="animate-spin h-10 w-10 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                {searchTerm || filterCategory || filterSubCategory
                  ? "No products match your search or filter criteria."
                  : "No products found."}
              </p>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs uppercase bg-gray-100">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Price (GHS)</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Subcategory</th>
                        <th className="px-4 py-3">Colors</th>
                        <th className="px-4 py-3">Tags</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium">
                            {product.name}
                          </td>
                          <td className="px-4 py-3">
                            {product.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">{product.quantity}</td>
                          <td className="px-4 py-3">{product.category}</td>
                          <td className="px-4 py-3">
                            {product.subCategory || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {product.colors?.join(", ") || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {product.tags?.join(", ") || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="text-indigo-600 hover:text-indigo-800 mr-4 text-xs font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800 text-xs font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      className="bg-gray-50 p-5 rounded-2xl shadow-sm border border-gray-200"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Name:</span>{" "}
                          <span>{product.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Price:</span>{" "}
                          <span>GHS {product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Quantity:</span>{" "}
                          <span>{product.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Category:</span>{" "}
                          <span>{product.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Subcategory:</span>{" "}
                          <span>{product.subCategory || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Colors:</span>{" "}
                          <span>{product.colors?.join(", ") || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Tags:</span>{" "}
                          <span>{product.tags?.join(", ") || "N/A"}</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-4 mt-5 pt-4 border-t">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.section>
        )}

        {activeTab === "orders" && (
          <motion.section
            key="orders"
            variants={childVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4 font-[Inter, sans-serif]">
              All Orders
            </h3>
            <AnimatePresence>
              {orderError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm md:text-base"
                >
                  {orderError}
                </motion.div>
              )}
            </AnimatePresence>
            {isLoadingOrders ? (
              <div className="flex justify-center items-center py-8">
                <svg
                  className="animate-spin h-8 w-8 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm md:text-base">
                No orders found.
              </p>
            ) : (
              <>
                {/* Desktop: Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs uppercase bg-gray-100">
                      <tr>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Total (GHS)</th>
                        <th className="px-4 py-3">Items</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            {order.transactionRef || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {order.customer ? (
                              <>
                                <div>{order.customer.name || "N/A"}</div>
                                <div className="text-xs text-gray-500">
                                  {order.customer.email || "N/A"}
                                </div>
                                {order.customer.phone && (
                                  <div className="text-xs text-gray-500">
                                    {order.customer.phone}
                                  </div>
                                )}
                                {order.customer.location && (
                                  <div className="text-xs text-gray-500">
                                    {order.customer.location}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-xs text-gray-500">
                                No customer data
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {order.totalAmount
                              ? order.totalAmount.toFixed(2)
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {order.cartItems && order.cartItems.length > 0 ? (
                              <ul className="list-disc list-inside">
                                {order.cartItems.map((item, index) => (
                                  <li key={index} className="text-xs">
                                    {item.name}{" "}
                                    {item.selectedColor &&
                                      `(${item.selectedColor})`}{" "}
                                    - Qty: {item.quantity}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              "No items"
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                order.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {order.status || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {order.createdAt?.toDate
                              ? order.createdAt
                                  .toDate()
                                  .toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile: Card View */}
                <div className="md:hidden space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      variants={childVariants}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">Order ID:</span>
                          <span className="text-sm">
                            {order.transactionRef || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">Customer:</span>
                          <div className="text-right text-sm">
                            {order.customer ? (
                              <>
                                <div>{order.customer.name || "N/A"}</div>
                                <div className="text-xs text-gray-500">
                                  {order.customer.email || "N/A"}
                                </div>
                                {order.customer.phone && (
                                  <div className="text-xs text-gray-500">
                                    {order.customer.phone}
                                  </div>
                                )}
                                {order.customer.location && (
                                  <div className="text-xs text-gray-500">
                                    {order.customer.location}
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">
                                No customer data
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">
                            Total (GHS):
                          </span>
                          <span className="text-sm">
                            {order.totalAmount
                              ? order.totalAmount.toFixed(2)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">Items:</span>
                          <div className="text-right text-sm">
                            {order.cartItems && order.cartItems.length > 0 ? (
                              <ul className="list-disc list-inside text-xs">
                                {order.cartItems.map((item, index) => (
                                  <li key={index}>
                                    {item.name}{" "}
                                    {item.selectedColor &&
                                      `(${item.selectedColor})`}{" "}
                                    - Qty: {item.quantity}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              "No items"
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">Status:</span>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              order.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">Date:</span>
                          <span className="text-sm">
                            {order.createdAt?.toDate
                              ? order.createdAt
                                  .toDate()
                                  .toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Edit Modal - unchanged */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                Edit Product: {editingProduct?.name}
              </h3>
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Price (GHS)
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
