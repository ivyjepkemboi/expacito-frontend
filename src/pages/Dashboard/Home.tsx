// Home.jsx
import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import RecentExpenses from "../../components/ecommerce/RecentExpenses";
import RecentIncome from "../../components/ecommerce/RecentIncome";
import Transactions from "../../components/transactions/Transactions";
import IncomeExpenseChart from "../../components/ecommerce/IncomeExpenseChart";
import AppHeader from "../../layout/AppHeader";
import { BASE_URL } from "../../api";
import HeadTransactions from "../../components/HeadTransactions";
import ExpenseIncomeBarchart from "../../components/ecommerce/ExpenseIncomeBarchart";

export default function Home() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ ADD THIS LINE

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/signin";
        return;
      }

      const response = await fetch(`${BASE_URL}/api/transactions`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data = await response.json();

      let incomeTotal = 0;
      let expenseTotal = 0;

      data.forEach((transaction) => {
        if (transaction.type === "income") {
          incomeTotal += transaction.amount;
        } else if (transaction.type === "expense") {
          expenseTotal += transaction.amount;
        }
      });

      setTotalIncome(incomeTotal);
      setTotalExpenses(expenseTotal);
      setTransactions(data); // ✅ Pass all transactions down
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshHeads = () => setRefreshTrigger((prev) => prev + 1); // ✅ Refresh function

  return (
    <>
      <PageMeta title="Income - Expense Tracker" description="This is an income-expense tracker" />
      <AppHeader />
          <Transactions
      transactions={transactions}
      setTransactions={setTransactions}
      fetchData={fetchData}
      refreshHeads={refreshHeads} // ✅ clearly add this
    />

<div className="grid grid-cols-12 gap-4 md:gap-6">

{/* Top Summary Section */}
<div className="col-span-12 xl:col-span-7">
  <HeadTransactions transactions={transactions} />
</div>

<div className="col-span-12 xl:col-span-5">
  <IncomeExpenseChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
</div>

{/* Middle Detailed Charts */}
<div className="col-span-12 xl:col-span-7">
  <ExpenseIncomeBarchart transactions={transactions}/>
</div>

<div className="col-span-12 xl:col-span-5">
  <RecentIncome transactions={transactions} loading={loading} />
</div>

{/* Bottom Recent Expenses (Full Width for clarity) */}
<div className="col-span-12">
  <RecentExpenses transactions={transactions} loading={loading} />
</div>

</div>

    </>
  );
}
