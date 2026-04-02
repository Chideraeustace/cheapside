// src/components/dashboard/CategoriesManager.js
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../Firebaseconfig";

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, "cs-categories"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(firestore, "cs-categories"), {
        name: newCategoryName.trim(),
        subCategories: [],
        createdAt: new Date(),
      });
      setNewCategoryName("");
      setMessage({ type: "success", text: "Category added successfully!" });
      fetchCategories();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to add category" });
    } finally {
      setLoading(false);
    }
  };

  const addSubCategory = async () => {
    if (!selectedCategoryId || !newSubCategory.trim()) return;

    try {
      const cat = categories.find((c) => c.id === selectedCategoryId);
      const updatedSubs = [...(cat.subCategories || []), newSubCategory.trim()];

      await updateDoc(doc(firestore, "cs-categories", selectedCategoryId), {
        subCategories: updatedSubs,
      });

      setNewSubCategory("");
      setMessage({ type: "success", text: "Sub-category added!" });
      fetchCategories();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to add sub-category" });
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteDoc(doc(firestore, "cs-categories", id));
      fetchCategories();
      setMessage({ type: "success", text: "Category deleted" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete" });
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-8">
        Manage Categories & Sub-Categories
      </h2>

      {message.text && (
        <div
          className={`p-4 rounded-xl mb-6 ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      {/* Add Category */}
      <div className="mb-10">
        <h3 className="font-medium mb-3">Add New Main Category</h3>
        <form onSubmit={addCategory} className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g. Kids Collection"
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-8 rounded-xl hover:bg-indigo-700"
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Add Sub-Category */}
      <div className="mb-10">
        <h3 className="font-medium mb-3">Add Sub-Category</h3>
        <div className="flex gap-3">
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 flex-1"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            placeholder="Sub-category name"
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600"
          />
          <button
            onClick={addSubCategory}
            className="bg-emerald-600 text-white px-8 rounded-xl hover:bg-emerald-700"
          >
            Add Sub
          </button>
        </div>
      </div>

      {/* List of Categories */}
      <h3 className="font-medium mb-4">Current Categories</h3>
      <div className="space-y-6">
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories created yet.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="border border-gray-200 rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-semibold">{cat.name}</h4>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.subCategories && cat.subCategories.length > 0 ? (
                  cat.subCategories.map((sub, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 px-4 py-2 rounded-full text-sm"
                    >
                      {sub}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No sub-categories yet
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoriesManager;
