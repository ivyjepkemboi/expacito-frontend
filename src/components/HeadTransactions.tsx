import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../api';
import { useNavigate } from "react-router";
import Button from './ui/button/Button';
import { Table, TableHeader, TableBody, TableCell, TableRow } from './ui/table';

export default function HeadTransactions({ transactions }) {
  const [heads, setHeads] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((transactions) => {
        const headSummary = {};
        transactions.forEach((txn) => {
          if (txn.type === 'expense' && txn.head) {
            headSummary[txn.head] = (headSummary[txn.head] || 0) + txn.amount;
          }
        });
        const summarizedHeads = Object.entries(headSummary).map(
          ([head, amount], index) => ({ id: index, head, amount })
        );
        setHeads(summarizedHeads);
      })
      .catch((err) => setError(err.message));
  }, [heads]);

  const handleViewDetails = (headName) => {
    navigate(`/heads/${encodeURIComponent(headName)}`);
  };
  

  return (

    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
       <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Expenses Summary</h3>
        <div className="flex items-center gap-3">
          <button size="sm" variant="secondary" onClick={() => setIsFilterModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
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
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200" size="sm" variant="primary" onClick={() => navigate("/expenses")}>
            See all
          </button>
        </div>
      </div>
      

      <Table>
        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
          <TableRow>
            <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Head
            </TableCell>
            <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Total Amount (Ksh)
            </TableCell>
            <TableCell isHeader className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Action
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {heads.length === 0 ? (
            <TableRow>
              <TableCell colSpan="3" className="text-center py-3 text-gray-500">
                No expenses recorded.
              </TableCell>
            </TableRow>
          ) : (
            heads.map(({ id, head, amount }) => (
              <TableRow key={id}>
                <TableCell className="py-3 text-gray-800 dark:text-white/90">
                  {head}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {amount.toLocaleString()}
                </TableCell>
                <TableCell className="py-3 flex gap-2">
                  <Button size="sm" variant="danger" onClick={() => handleViewDetails(head)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
    
    
  );
}
