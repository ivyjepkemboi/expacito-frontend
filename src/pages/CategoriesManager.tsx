import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router";
import { BASE_URL } from "../api";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";

export default function CategoriesManager() {
  const [heads, setHeads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedHead, setSelectedHead] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [newHead, setNewHead] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  const token = localStorage.getItem("token");

  const fetchHeads = () => {
    fetch(`${BASE_URL}/api/heads`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setHeads);
  };

  useEffect(fetchHeads, [token]);

  const handleViewHead = (uuid: string) => {
    setSelectedHead(uuid);
    setSelectedCategory("");
    setSubcategories([]);
  
    fetch(`${BASE_URL}/api/heads/${uuid}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        // 👇 Update the count for this head
        setCategoryCounts(prev => ({ ...prev, [uuid]: data.length }));
      });
  };
  

  const handleCategorySelect = (uuid: string) => {
    setSelectedCategory(uuid);
    fetch(`${BASE_URL}/api/categories/${uuid}/subcategories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setSubcategories);
  };

  const handleAddHead = () => {
    fetch(`${BASE_URL}/api/heads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newHead }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.uuid) {
          setNewHead("");
          fetchHeads();
        } else {
          alert(data.error || "Failed to create head");
        }
      });
  };

  const handleAddCategory = () => {
    fetch(`${BASE_URL}/api/heads/${selectedHead}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newCategory }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.uuid) {
          setNewCategory("");
          handleViewHead(selectedHead);
        } else {
          alert(data.error || "Failed to create category");
        }
      });
  };

  const handleAddSubcategory = () => {
    fetch(`${BASE_URL}/api/categories/${selectedCategory}/subcategories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newSubcategory }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.uuid) {
          setNewSubcategory("");
          handleCategorySelect(selectedCategory);
        } else {
          alert(data.error || "Failed to create subcategory");
        }
      });
  };

  return (
    <HelmetProvider>
      <PageMeta title="Manage Categories | TailAdmin" description="View and manage heads, categories, and subcategories" />
      <PageBreadcrumb pageTitle="Manage Categories" />

      {/* Heads Table */}
      <ComponentCard title="Heads Table">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-4 py-2 text-left text-theme-xs text-gray-500 dark:text-gray-400">Head Name</TableCell>
                  <TableCell isHeader className="px-4 py-2 text-left text-theme-xs text-gray-500 dark:text-gray-400"># of Categories</TableCell>
                  <TableCell isHeader className="px-4 py-2 text-left text-theme-xs text-gray-500 dark:text-gray-400">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {heads.map((head: any) => (
                  <TableRow key={head.uuid}>
                    <TableCell className="px-4 py-3">{head.name}</TableCell>
                    <TableCell className="px-4 py-3"> {categoryCounts[head.uuid] ?? 'computing'} </TableCell>

                    <TableCell className="px-4 py-3 flex gap-2">
                      <button className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700" onClick={() => handleViewHead(head.uuid)}>
                        View
                      </button>
                
                      <button
                        onClick={() => alert("Delete Head")}
                        className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add Head */}
          <div className="flex items-center gap-2 p-4 border-t">
            <input
              type="text"
              value={newHead}
              onChange={(e) => setNewHead(e.target.value)}
              placeholder="New head name"
              className="border rounded px-3 py-1 text-sm"
            />
            <button
              onClick={handleAddHead}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Add Head
            </button>
          </div>
        </div>
      </ComponentCard>

      {/* Categories & Subcategories */}
      {selectedHead && (
        <ComponentCard title="Categories & Subcategories">
          <div className="grid grid-cols-2 gap-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Categories</h3>
              {categories.map((cat: any) => (
                <button
                  key={cat.uuid}
                  onClick={() => handleCategorySelect(cat.uuid)}
                  className={`block w-full text-left p-2 mb-1 rounded border ${
                    selectedCategory === cat.uuid ? "bg-green-100" : ""
                  }`}
                >
                  {cat.name}
                </button>
              ))}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="border rounded px-3 py-1 text-sm w-full"
                />
                <button
                  onClick={handleAddCategory}
                  disabled={!selectedHead}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Subcategories */}
            <div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Subcategories</h3>
              {subcategories.map((sub: any) => (
                <div key={sub.uuid} className="p-2 mb-1 rounded border">{sub.name}</div>
              ))}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  placeholder="New subcategory name"
                  className="border rounded px-3 py-1 text-sm w-full"
                />
                <button
                  onClick={handleAddSubcategory}
                  disabled={!selectedCategory}
                  className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        </ComponentCard>
      )}
    </HelmetProvider>
  );
}
