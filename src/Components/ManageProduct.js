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
import { FaSearch, FaFilter } from "react-icons/fa";

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

  // Fetch products
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

  // Get subcategories for filter
  const currentCategory = categories.find((cat) => cat.name === filterCategory);
  const availableSubCategories = currentCategory?.subCategories || [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-2xl font-semibold mb-6">Manage Products</h3>

      {/* Search & Filter */}
      <div className="mb-8 bg-gray-50 p-5 rounded-2xl border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-600 text-sm"
            />
          </div>

          {/* Dynamic Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setFilterSubCategory("");
            }}
            className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-600 bg-white text-sm min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Dynamic Subcategory Filter */}
          {filterCategory && availableSubCategories.length > 0 && (
            <select
              value={filterSubCategory}
              onChange={(e) => setFilterSubCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-600 bg-white text-sm min-w-[200px]"
            >
              <option value="">All Subcategories</option>
              {availableSubCategories.map((sub, index) => (
                <option key={index} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
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

      {productError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
          {productError}
        </div>
      )}

      {isLoadingProducts ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center py-12 text-gray-500">
          {searchTerm || filterCategory || filterSubCategory
            ? "No products match your search or filter criteria."
            : "No products found."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price (GHS)</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Subcategory</th>
                <th className="px-4 py-3">Variants</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const imageCount = product.images?.length || 1;
                const firstImage = product.images?.[0]?.url || product.image;

                return (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {firstImage ? (
                        <img
                          src={firstImage}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">
                      GHS {Number(product.price || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{product.quantity || 0}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">{product.subCategory || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                        {imageCount} variant{imageCount > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-indigo-600 hover:text-indigo-800 mr-4 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-8 rounded-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-6">
                Edit {editingProduct?.name}
              </h3>
              <form onSubmit={handleUpdateProduct} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Price (GHS)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600"
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
                    className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                    }}
                    className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700"
                  >
                    Update Product
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
