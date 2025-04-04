import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { BASE_URL } from "../../api";

export default function RecentExpenses({ transactions, loading }) {
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const expenseList = transactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    setFilteredExpenses(expenseList);
  }, [transactions]);

  const handleFilter = () => {
    let filtered = transactions.filter((t) => t.type === "expense");

    if (selectedCategory) {
      filtered = filtered.filter((expense) => expense.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }
    if (selectedDate) {
      filtered = filtered.filter((expense) =>
        new Date(expense.timestamp).toISOString().split("T")[0] === selectedDate
      );
    }

    setFilteredExpenses(filtered.slice(0, 5));
    setIsFilterModalOpen(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Expenses</h3>
        <div className="flex items-center gap-3">
        <button size="sm" variant="outline" onClick={() => setIsFilterModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            size="sm"
            variant="primary"
            onClick={() => navigate("/expenses")}
          >
            See all
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center mt-3">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-3">{error}</p>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Head
                </TableCell>
                <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Category
                </TableCell>
                <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Subcategory
                </TableCell>
                <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Amount (Ksh)
                </TableCell>
                <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Date
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center py-3 text-gray-500">
                    No expenses recorded.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.uuid}>
                    <TableCell className="py-3 text-gray-800 dark:text-white/90">
                      {expense.head || "-"}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {expense.category}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {expense.subcategory || "-"}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {new Date(expense.timestamp).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {isFilterModalOpen && (
        <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} title="Filter Expenses">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              placeholder="Enter category"
              className="w-full p-2 border rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsFilterModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleFilter}>
              Apply Filter
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
