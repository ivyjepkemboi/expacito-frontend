import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Button from "../components/ui/button/Button";
import { Modal } from "../components/ui/modal";
import { BASE_URL } from "../api";
import AppHeader from "../layout/AppHeader";

export default function HeadDetails() {
  const { headName } = useParams();
  const token = localStorage.getItem("token");

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(false);

  const [heads, setHeads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/api/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const headTxns = data.filter((t) => t.type === "expense" && t.head === headName);
        setTransactions(headTxns);
        setFilteredTransactions(headTxns);
      })
      .catch((err) => setError(err.message));

    fetch(`${BASE_URL}/api/heads`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setHeads);
  }, [token, headName]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterTransactions(selectedCategory, selectedSubcategory, query);
  };

  const filterTransactions = (category, subcategory, query) => {
    setFilteredTransactions(
      transactions.filter((txn) => {
        const matchesCategory = category ? txn.category === category : true;
        const matchesSubcategory = subcategory ? txn.subcategory === subcategory : true;
        const matchesQuery =
          txn.category.toLowerCase().includes(query) ||
          txn.subcategory.toLowerCase().includes(query) ||
          txn.description?.toLowerCase().includes(query);
        return matchesCategory && matchesSubcategory && matchesQuery;
      })
    );
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedSubcategory("");
    filterTransactions(value, "", searchQuery);
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    setSelectedSubcategory(value);
    filterTransactions(selectedCategory, value, searchQuery);
  };

  const fetchCategories = (headId) => {
    fetch(`${BASE_URL}/api/heads/${headId}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCategories);
  };

  const fetchSubcategories = (categoryId) => {
    fetch(`${BASE_URL}/api/categories/${categoryId}/subcategories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setSubcategories);
  };

  const openEditModal = (txn) => {
    setEditingTransaction({
      ...txn,
      transaction_date: txn.transaction_date.split("T")[0],
    });

    const headObj = heads.find((h) => h.name === txn.head);
    if (headObj) {
      fetchCategories(headObj.uuid);
      const categoryObj = categories.find((c) => c.name === txn.category);
      if (categoryObj) fetchSubcategories(categoryObj.uuid);
    }

    setIsEditModalOpen(true);
  };

  const handleUpdateTransaction = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/transactions/${editingTransaction.uuid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingTransaction),
      });

      if (!res.ok) throw new Error("Failed to update transaction");

      setTransactions((prev) =>
        prev.map((txn) => (txn.uuid === editingTransaction.uuid ? editingTransaction : txn))
      );
      setFilteredTransactions((prev) =>
        prev.map((txn) => (txn.uuid === editingTransaction.uuid ? editingTransaction : txn))
      );

      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  const uniqueCategories = [...new Set(transactions.map(txn => txn.category))];
  const uniqueSubcategories = [...new Set(transactions.filter(txn => !selectedCategory || txn.category === selectedCategory).map(txn => txn.subcategory))];

  return (
    <>
    <AppHeader/>
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Transactions for "{headName}"</h2>

      {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}
{/* 
      <input
        type="text"
        placeholder="Search category, subcategory, or description"
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-2 border rounded-md mb-4"
      /> */}

      <div className="flex gap-4 mb-4">
        <select
          className="w-1/2 p-2 border rounded"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select a category</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="w-1/2 p-2 border rounded"
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
        >
          <option value="">Select a sub-category</option>
          {uniqueSubcategories.map((subcat) => (
            <option key={subcat} value={subcat}>{subcat}</option>
          ))}
        </select>
      </div>

      <table className="w-full bg-white rounded-md shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Subcategory</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((txn) => (
            <tr key={txn.uuid} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{new Date(txn.transaction_date).toLocaleDateString()}</td>
              <td className="px-4 py-2">{txn.category}</td>
              <td className="px-4 py-2">{txn.subcategory}</td>
              <td className="px-4 py-2">{txn.description || "-"}</td>
              <td className="px-4 py-2">{txn.amount.toLocaleString()}</td>
              <td className="px-4 py-2 text-center space-x-2">
                <Button variant="primary" size="sm" onClick={() => openEditModal(txn)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-right font-semibold text-lg">
        Total Amount: {totalAmount.toLocaleString()}
      </p>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Transaction">
        {editingTransaction && (
          <>
            <label>Amount</label>
            <input
              className="w-full p-2 border rounded"
              type="number"
              value={editingTransaction.amount}
              onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) })}
            />

            <label>Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={editingTransaction.transaction_date}
              onChange={(e) => setEditingTransaction({ ...editingTransaction, transaction_date: e.target.value })}
            />

            <label>Head</label>
            <select className="w-full p-2 border rounded" onChange={(e) => {
              setEditingTransaction({ ...editingTransaction, head_uuid: e.target.value });
              fetchCategories(e.target.value);
            }}>
              <option>Select Head</option>
              {heads.map(h => <option key={h.uuid} value={h.uuid}>{h.name}</option>)}
            </select>

            <label>Category</label>
            <select className="w-full p-2 border rounded" onChange={(e) => {
              setEditingTransaction({ ...editingTransaction, category_uuid: e.target.value });
              fetchSubcategories(e.target.value);
            }}>
              <option>Select Category</option>
              {categories.map(c => <option key={c.uuid} value={c.uuid}>{c.name}</option>)}
            </select>

            <label>Subcategory</label>
            <select className="w-full p-2 border rounded" onChange={(e) => {
              setEditingTransaction({ ...editingTransaction, subcategory_uuid: e.target.value });
            }}>
              <option>Select Subcategory</option>
              {subcategories.map(s => <option key={s.uuid} value={s.uuid}>{s.name}</option>)}
            </select>

            <label>Description</label>
            <textarea
              className="w-full p-2 border rounded"
              value={editingTransaction.description}
              onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
            />
            <Button onClick={handleUpdateTransaction}>{loading ? 'Updating...' : 'Update'}</Button>
          </>
        )}
      </Modal>
    </div>
    </>
  );
}