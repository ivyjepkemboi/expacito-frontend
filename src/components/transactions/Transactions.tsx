import { useState, useEffect } from "react";
import Button from "../../components/ui/button/Button";
import { BoxIcon } from "../../icons/";
import { Modal } from "../../components/ui/modal";
import { BASE_URL } from "../../api";
import { useNavigate } from "react-router";

export default function Transactions({ transactions, setTransactions, fetchData, refreshHeads }) // ✅ clearly added here
  {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [heads, setHeads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedHead, setSelectedHead] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newItemModal, setNewItemModal] = useState({ open: false, type: "", name: "" });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/heads`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setHeads(data))
      .catch((err) => setError(err.message));
  }, [token]);

  const openModal = (type) => {
    setModalContent(type);
    setAmount("");
    setDescription("");
    setSource("");
    setSelectedHead("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setCategories([]);
    setSubcategories([]);
    setError(null);
    setIsModalOpen(true);
  };

  const handleHeadSelect = (e) => {
    const headId = e.target.value;
    setSelectedHead(headId);
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSubcategories([]);

    if (headId) {
      fetch(`${BASE_URL}/api/heads/${headId}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => setError(err.message));
    } else setCategories([]);
  };

  const handleCategorySelect = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubcategory("");

    if (categoryId) {
      fetch(`${BASE_URL}/api/categories/${categoryId}/subcategories`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setSubcategories(data))
        .catch((err) => setError(err.message));
    } else setSubcategories([]);
  };

  const handleSubcategorySelect = (e) => setSelectedSubcategory(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const transactionData =
      modalContent === "Add Income"
        ? { type: "income", source, amount: parseFloat(amount), description }
        : {
            type: "expense",
            head_id: parseInt(selectedHead),
            category_id: parseInt(selectedCategory),
            subcategory_id: parseInt(selectedSubcategory),
            title: description,
            amount: parseFloat(amount),
            description,
          };

    try {
      const response = await fetch(`${BASE_URL}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save transaction");

      setIsModalOpen(false);

       await fetchData();

       refreshHeads(); // ✅ explicitly added here to refresh HeadTransactions.jsx
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemModal.name.trim()) return;
  
    const endpointMap = {
      head: "/api/heads",
      category: `/api/heads/${selectedHead}/categories`,
      subcategory: `/api/categories/${selectedCategory}/subcategories`,
    };
  
    const endpoint = endpointMap[newItemModal.type];
  
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newItemModal.name }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add item");
  
      const newItem = { id: data.id, name: newItemModal.name };
  
      if (newItemModal.type === "head") setHeads([...heads, newItem]);
      else if (newItemModal.type === "category") setCategories([...categories, newItem]);
      else if (newItemModal.type === "subcategory") setSubcategories([...subcategories, newItem]);
  
      setNewItemModal({ open: false, type: "", name: "" });
  
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <>
      <div className="flex justify-end m-4 space-x-4">
        <Button size="sm" variant="primary" startIcon={<BoxIcon className="size-5" />} onClick={() => openModal("Add Income")}>
          Add Income
        </Button>
        <Button size="sm" variant="primary" startIcon={<BoxIcon className="size-5" />} onClick={() => openModal("Add Expense")}>
          Add Expense
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent}>
        <div className="mt-4">
          {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm font-medium">Amount</label>
            <input type="number" className="w-full p-2 border rounded-md" value={amount} onChange={(e) => setAmount(e.target.value)} required />

            {modalContent === "Add Income" && (
              <>
                <label className="block mt-3 mb-2 text-sm font-medium">Source</label>
                <input type="text" className="w-full p-2 border rounded-md" value={source} onChange={(e) => setSource(e.target.value)} required />
              </>
            )}

            {modalContent === "Add Expense" && (
              <>
                {["head", "category", "subcategory"].map((field) => (
                  <div key={field}>
                    <div className="flex items-center justify-between mt-3 mb-2">
                      <label className="block text-sm font-medium capitalize">{field}</label>
                      <Button size="xs" variant="primary" onClick={() => setNewItemModal({ open: true, type: field, name: "" })}>
                        Add New
                      </Button>
                    </div>
                    <select className="w-full p-2 border rounded-md" value={{ head: selectedHead, category: selectedCategory, subcategory: selectedSubcategory }[field]} onChange={{ head: handleHeadSelect, category: handleCategorySelect, subcategory: handleSubcategorySelect }[field]} required>
                      <option value="">Select {field}</option>
                      {(field === "head" ? heads : field === "category" ? categories : subcategories).map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </>
            )}

            <label className="block mt-3 mb-2 text-sm font-medium">Description</label>
            <textarea className="w-full p-2 border rounded-md" value={description} onChange={(e) => setDescription(e.target.value)} />

            <div className="mt-4 flex justify-end">
              <Button variant="primary" size="sm" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={newItemModal.open} onClose={() => setNewItemModal({ open: false })} title={`Add ${newItemModal.type}`}>
        <form onSubmit={handleAddItem}>
          <input className="w-full p-2 border rounded-md" value={newItemModal.name} onChange={(e) => setNewItemModal({ ...newItemModal, name: e.target.value })} required />
          <div className="mt-4 flex justify-end">
            <Button variant="primary" size="sm" type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
