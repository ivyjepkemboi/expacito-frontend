import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

export default function IncomeExpenseChart({ totalIncome, totalExpenses }) {
  const [series, setSeries] = useState([0, 0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const total = totalIncome + totalExpenses;
    if (total > 0) {
      const incomeRatio = ((totalIncome / total) * 100).toFixed(2);
      const expenseRatio = (100 - incomeRatio).toFixed(2);
      setSeries([parseFloat(incomeRatio), parseFloat(expenseRatio)]);
    } else {
      setSeries([0, 0]);
    }
  }, [totalIncome, totalExpenses]);

  const options = {
    colors: ["#465FFF", "#E4E7EC"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      height: 200,
      sparkline: { enabled: true },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Income %",
              formatter: () => `${series[0]}%`,
              fontSize: "36px",
              fontWeight: "600",
              color: "#1D2939",
            },
          },
        },
      },
    },
    stroke: { lineCap: "round" },
    labels: ["Income", "Expenses"],
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Income vs Expenses
            </h3>
            </div>
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem
                onItemClick={closeDropdown}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-white/5"
              >
                View More
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="relative">
          <Chart options={options} series={series} type="donut" height={240} />
        </div>
        <p className="mt-5 text-center text-gray-500 text-sm">
          You have spent {series[1]}% of your total funds.
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Total Income
          </p>
          <p className="text-base font-semibold text-center text-gray-800 dark:text-white/90 sm:text-lg">
            Ksh {totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Total Expenses
          </p>
          <p className="text-base font-semibold text-center text-gray-800 dark:text-white/90 sm:text-lg">
            Ksh {totalExpenses.toLocaleString()}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Balance
          </p>
          <p className="text-base font-semibold text-center text-gray-800 dark:text-white/90 sm:text-lg">
            Ksh {(totalIncome - totalExpenses).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
