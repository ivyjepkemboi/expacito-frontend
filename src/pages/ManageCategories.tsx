import { useState, useEffect } from "react";
import { BASE_URL } from "../api";
import { ShadButton } from "../components/ui/button";

export default function ManageCategories() {
  const [heads, setHeads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [selectedHead, setSelectedHead] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${BASE_URL}/api/heads`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setHeads(data));
  }, [token]);

  const handleHeadSelect = (uuid) => {
    setSelectedHead(uuid);
    setSelectedCategory("");
    setSubcategories([]);
    fetch(`${BASE_URL}/api/heads/${uuid}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data));
  };

  const handleCategorySelect = (uuid) => {
    setSelectedCategory(uuid);
    fetch(`${BASE_URL}/api/categories/${uuid}/subcategories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSubcategories(data));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <div className="grid grid-cols-3 gap-6">
        {/* HEADS */}
        <div>
          <h2 className="font-semibold mb-2">Heads</h2>
          {heads.map((head) => (
            <button
              key={head.uuid}
              onClick={() => handleHeadSelect(head.uuid)}
              className={`block w-full text-left p-2 mb-1 rounded border ${
                head.uuid === selectedHead ? "bg-blue-100" : ""
              }`}
            >
              {head.name}
            </button>
          ))}
          <ShadButton variant="primary" size="sm" className="mt-2">
            + Add Head
          </ShadButton>
        </div>

        {/* CATEGORIES */}
        <div>
          <h2 className="font-semibold mb-2">Categories</h2>
          {categories.map((cat) => (
            <button
              key={cat.uuid}
              onClick={() => handleCategorySelect(cat.uuid)}
              className={`block w-full text-left p-2 mb-1 rounded border ${
                cat.uuid === selectedCategory ? "bg-green-100" : ""
              }`}
            >
              {cat.name}
            </button>
          ))}
          <ShadButton variant="primary" size="sm" className="mt-2" disabled={!selectedHead}>
            + Add Category
          </ShadButton>
        </div>

        {/* SUBCATEGORIES */}
        <div>
          <h2 className="font-semibold mb-2">Subcategories</h2>
          {subcategories.map((sub) => (
            <div key={sub.uuid} className="p-2 mb-1 rounded border">
              {sub.name}
            </div>
          ))}
          <ShadButton variant="primary" size="sm" className="mt-2" disabled={!selectedCategory}>
            + Add Subcategory
          </ShadButton>
        </div>
      </div>
    </div>
  );
}
