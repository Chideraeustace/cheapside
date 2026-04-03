// src/components/dashboard/ManageProducts.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../Firebaseconfig";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

const ManageProducts = ({
  products,
  setProducts,
  categories,
  isLoadingProducts,
  setIsLoadingProducts,
  productError,
  setProductError,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubCategory, setFilterSubCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      setProductError("");
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "cs-products"),
        );
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductError("Failed to load products.");
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [setProducts, setIsLoadingProducts, setProductError]);

  // --- FIXED FILTER LOGIC ---
  const filteredProducts = products.filter((product) => {
    // 1. Search Filter (Case-insensitive & Trimmed)
    const matchesSearch = (product.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());

    // 2. Category Filter (Exact match after normalization)
    const matchesCategory =
      !filterCategory ||
      product.category?.trim().toLowerCase() ===
        filterCategory.trim().toLowerCase();

    // 3. SubCategory Filter (Exact match after normalization)
    const matchesSubCategory =
      !filterSubCategory ||
      product.subCategory?.trim().toLowerCase() ===
        filterSubCategory.trim().toLowerCase();

    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteDoc(doc(firestore, "cs-products", id));
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      setProductError("Failed to delete product.");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editPrice || !editQuantity) {
      alert("Price and quantity are required");
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
      alert("Failed to update product");
    }
  };

  useEffect(() => {
    if (editingProduct) {
      setEditPrice(editingProduct.price?.toString() || "");
      setEditQuantity(editingProduct.quantity?.toString() || "");
      setShowModal(true);
    }
  }, [editingProduct]);

  // Dynamic Subcategory Logic
  const currentCategory = categories.find(
    (cat) =>
      cat.name?.trim().toLowerCase() === filterCategory?.trim().toLowerCase(),
  );
  const availableSubCategories = currentCategory?.subCategories || [];

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterSubCategory("");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-gray-900 uppercase italic">
          Manage Products
        </h3>
        {(searchTerm || filterCategory) && (
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline"
          >
            <FaTimes /> Reset Filters
          </button>
        )}
      </div>

      {/* Search & Filter Section */}
      <div className="mb-8 bg-gray-50 p-5 rounded-2xl border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-600 text-sm outline-none transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setFilterSubCategory(""); // Reset subcat when cat changes
            }}
            className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-600 bg-white text-sm outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Subcategory Dropdown */}
          <select
            value={filterSubCategory}
            onChange={(e) => setFilterSubCategory(e.target.value)}
            disabled={!filterCategory || availableSubCategories.length === 0}
            className={`px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-600 bg-white text-sm outline-none transition-opacity ${
              !filterCategory ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
          >
            <option value="">
              {!filterCategory
                ? "Select a Category first"
                : "All Subcategories"}
            </option>
            {availableSubCategories.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-500 flex items-center gap-2 font-medium">
          <FaFilter className="text-indigo-600" />
          Showing{" "}
          <span className="text-indigo-600 font-bold">
            {filteredProducts.length}
          </span>{" "}
          of {products.length} products
        </div>
      </div>

      {/* Product Table */}
      {isLoadingProducts ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-400 font-bold animate-pulse">
            Synchronizing Inventory...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">
            No products found matching your current filters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 text-white uppercase text-[11px] tracking-widest">
                <th className="px-6 py-4 rounded-tl-xl">Product</th>
                <th className="px-6 py-4 text-center">Pricing</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4">Categorization</th>
                <th className="px-6 py-4 rounded-tr-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const firstImage = product.images?.[0]?.url || product.image;
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={firstImage || "/placeholder.png"}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 bg-white"
                          alt=""
                        />
                        <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-gray-700">
                      GHS {Number(product.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-lg font-bold ${
                          (product.quantity || 0) < 5
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {product.quantity || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">
                          {product.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          {product.subCategory || "No Subcategory"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal (Logic Remains the same) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-[2rem] max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase italic">
                Quick Update
              </h3>
              <form onSubmit={handleUpdateProduct} className="space-y-5">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Price (GHS)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Stock Level
                  </label>
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                    }}
                    className="flex-1 px-6 py-4 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProducts;
