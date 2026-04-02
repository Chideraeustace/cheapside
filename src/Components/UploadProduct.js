// src/components/dashboard/UploadProduct.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "../Firebaseconfig";

const UploadProduct = ({ setProducts, categories }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImages, setProductImages] = useState([]); // Multiple images for variants
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedCategoryObj = categories.find(
    (cat) => cat.id === productCategory,
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
  };

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
    if (productImages.length === 0) {
      setErrorMessage(
        "Please select at least one image for the product variants.",
      );
      return;
    }

    setIsUploading(true);

    try {
      const uploadedImages = [];

      // Upload all selected images
      for (let i = 0; i < productImages.length; i++) {
        const file = productImages[i];
        const imageRef = ref(storage, `images/${Date.now()}_${i}_${file.name}`);
        const snapshot = await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(snapshot.ref);

        uploadedImages.push({
          url: imageUrl,
          color: `Variant ${i + 1}`, // Default fallback since color input is removed
        });
      }

      const tags = [];
      if (isNewArrival) tags.push("new arrivals");
      if (isTrending) tags.push("trending now");

      const categoryName = selectedCategoryObj
        ? selectedCategoryObj.name
        : productCategory;

      const docRef = await addDoc(collection(firestore, "cs-products"), {
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        images: uploadedImages, // Array of {url, color}
        category: categoryName,
        subCategory: productSubCategory || null,
        quantity: parseInt(productQuantity),
        tags,
        createdAt: new Date(),
      });

      const newProduct = {
        id: docRef.id,
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        images: uploadedImages,
        category: categoryName,
        subCategory: productSubCategory || null,
        quantity: parseInt(productQuantity),
        tags,
      };

      setProducts((prev) => [newProduct, ...prev]);

      // Reset form
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setProductImages([]);
      setProductCategory("");
      setProductSubCategory("");
      setProductQuantity("");
      setIsNewArrival(false);
      setIsTrending(false);

      setSuccessMessage(
        "Product uploaded successfully with multiple variant images!",
      );
    } catch (error) {
      setErrorMessage(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md">
      <h3 className="text-2xl font-semibold mb-6">Upload New Product</h3>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl"
          >
            {errorMessage}
          </motion.div>
        )}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleUploadProduct}
        className="space-y-6 md:grid md:grid-cols-2 md:gap-6"
      >
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600"
            required
            disabled={isUploading}
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Price (GHS)</label>
          <input
            type="number"
            step="0.01"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600"
            required
            disabled={isUploading}
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600"
            required
            disabled={isUploading}
          />
        </div>

        {/* Bulk Images for Variants */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-gray-700 font-medium">
            Product Images (One image per color/variant)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-3 rounded-xl"
            required
            disabled={isUploading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload multiple images — each image represents a different color or
            variant of this product.
          </p>
          {productImages.length > 0 && (
            <p className="text-sm text-emerald-600 font-medium">
              {productImages.length} image(s) selected for variants
            </p>
          )}
        </div>

        {/* Dynamic Category */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Category</label>
          <select
            value={productCategory}
            onChange={(e) => {
              setProductCategory(e.target.value);
              setProductSubCategory("");
            }}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600"
            required
            disabled={isUploading}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Subcategory */}
        {selectedCategoryObj?.subCategories?.length > 0 && (
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Subcategory
            </label>
            <select
              value={productSubCategory}
              onChange={(e) => setProductSubCategory(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600"
              required
              disabled={isUploading}
            >
              <option value="">Select Subcategory</option>
              {selectedCategoryObj.subCategories.map((sub, index) => (
                <option key={index} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Total Quantity
          </label>
          <input
            type="number"
            min="0"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-600"
            required
            disabled={isUploading}
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
              disabled={isUploading}
            />
            New Arrival
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isTrending}
              onChange={(e) => setIsTrending(e.target.checked)}
              disabled={isUploading}
            />
            Trending Now
          </label>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isUploading}
            className="bg-indigo-600 text-white py-3.5 px-10 rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 w-full md:w-auto font-medium"
          >
            {isUploading ? "Uploading Product..." : "Upload Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadProduct;
