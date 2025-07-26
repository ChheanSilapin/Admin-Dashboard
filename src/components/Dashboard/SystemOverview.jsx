

const SystemOverview = () => {
  const chartData = [
    { month: 'Jan', customers: 65, transactions: 1280, banks: 18 },
    { month: 'Feb', customers: 78, transactions: 1450, banks: 19 },
    { month: 'Mar', customers: 90, transactions: 1620, banks: 20 },
    { month: 'Apr', customers: 81, transactions: 1380, banks: 21 },
    { month: 'May', customers: 95, transactions: 1750, banks: 22 },
    { month: 'Jun', customers: 110, transactions: 1890, banks: 24 },
  ];

  const maxCustomers = Math.max(...chartData.map(d => d.customers));
  const maxTransactions = Math.max(...chartData.map(d => d.transactions));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Banking System Overview
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Customer growth and transaction volume trends
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Customers</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Transactions</span>
          </div>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="h-56 flex items-end justify-between space-x-3">
        {chartData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center space-y-1 mb-3">
              {/* Transactions Bar */}
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg">
                <div
                  className="bg-success-500 rounded-t-lg transition-all duration-700 ease-out"
                  style={{
                    height: `${(data.transactions / maxTransactions) * 100}px`,
                    minHeight: '6px',
                  }}
                ></div>
              </div>
              {/* Customer Bar */}
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-b-lg">
                <div
                  className="bg-brand-500 rounded-b-lg transition-all duration-700 ease-out"
                  style={{
                    height: `${(data.customers / maxCustomers) * 70}px`,
                    minHeight: '6px',
                  }}
                ></div>
              </div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {data.month}
            </span>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Customer Growth</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">+69%</p>
          <p className="text-xs text-success-600 dark:text-success-400">↗ +12% this month</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Monthly Transactions</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">1,562</p>
          <p className="text-xs text-green-600 dark:text-green-400">↗ +8.2% this month</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Bank Partners</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">24</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">↗ +3 new partners</p>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
