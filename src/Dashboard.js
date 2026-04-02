// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "./Firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./Firebaseconfig";

import UploadProduct from "./Components/UploadProduct";
import ManageProducts from "./Components/ManageProduct";
import Orders from "./Components/Orders";
import CategoriesManager from "./Components/CategoriesManager";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("upload");

  // Shared state
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]); // ← New

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [productError, setProductError] = useState("");
  const [orderError, setOrderError] = useState("");

  const navigate = useNavigate();
  const storeOwnerEmail = "chideraeustace99@gmail.com";

  // Fetch categories once (shared across components)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, "cs-categories"));
        const cats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  if (!auth.currentUser || auth.currentUser.email !== storeOwnerEmail) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-12 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Access Denied</h2>
        <p className="text-red-500 mb-6">
          Only the store owner can access the dashboard.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white py-3 px-8 rounded-full hover:bg-indigo-700"
        >
          ← Back to Store
        </button>
      </motion.div>
    );
  }

  const tabs = [
    { id: "upload", label: "Upload Product" },
    { id: "manage", label: "Manage Products" },
    { id: "categories", label: "Categories" },
    { id: "orders", label: "Orders" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Store Owner Dashboard
        </h1>
        <button
          onClick={() => navigate("/")}
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-6 rounded-full flex items-center gap-2"
        >
          ← Back to Store
        </button>
      </div>

      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 md:flex-none px-8 py-4 font-medium text-base whitespace-nowrap border-b-4 -mb-px transition-all ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "upload" && (
          <UploadProduct setProducts={setProducts} categories={categories} />
        )}
        {activeTab === "manage" && (
          <ManageProducts
            products={products}
            setProducts={setProducts}
            categories={categories}
            isLoadingProducts={isLoadingProducts}
            setIsLoadingProducts={setIsLoadingProducts}
            productError={productError}
            setProductError={setProductError}
          />
        )}
        {activeTab === "categories" && (
          <CategoriesManager
            onCategoriesChange={() => {
              /* refresh logic if needed */
            }}
          />
        )}
        {activeTab === "orders" && (
          <Orders
            orders={orders}
            setOrders={setOrders}
            isLoadingOrders={isLoadingOrders}
            setIsLoadingOrders={setIsLoadingOrders}
            orderError={orderError}
            setOrderError={setOrderError}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
