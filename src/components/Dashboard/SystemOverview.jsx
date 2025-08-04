
import { useDashboard } from '../../hooks/useDashboard';

const SystemOverview = () => {
  const { dashboardData, loading, error } = useDashboard();

  const getChartData = () => {
    const { monthlyStats } = dashboardData;

    if (!monthlyStats || monthlyStats.length === 0) {
      return [
        { month: 'Jan', customers: 0, transactions: 0, banks: 0 },
        { month: 'Feb', customers: 0, transactions: 0, banks: 0 },
        { month: 'Mar', customers: 0, transactions: 0, banks: 0 },
        { month: 'Apr', customers: 0, transactions: 0, banks: 0 },
        { month: 'May', customers: 0, transactions: 0, banks: 0 },
        { month: 'Jun', customers: 0, transactions: 0, banks: 0 },
      ];
    }

    // Get the last 6 months of data
    return monthlyStats.slice(-6).map(stat => ({
      month: stat.month,
      customers: stat.customers || 0,
      transactions: stat.transactions || 0,
      banks: stat.banks || 0
    }));
  };

  const calculateGrowthStats = () => {
    const { monthlyStats } = dashboardData;

    if (!monthlyStats || monthlyStats.length < 2) {
      return {
        customerGrowth: '0%',
        customerGrowthChange: '0%',
        avgMonthlyTransactions: '0',
        transactionGrowthChange: '0%',
        totalBankPartners: '0',
        bankGrowthChange: '0'
      };
    }

    const currentMonth = monthlyStats[monthlyStats.length - 1];
    const previousMonth = monthlyStats[monthlyStats.length - 2];
    const firstMonth = monthlyStats[0];

    // Calculate customer growth percentage from first to current month
    const customerGrowthPercent = firstMonth.customers > 0
      ? Math.round(((currentMonth.customers - firstMonth.customers) / firstMonth.customers) * 100)
      : 0;

    // Calculate month-over-month customer growth
    const customerMonthGrowth = previousMonth.customers > 0
      ? Math.round(((currentMonth.customers - previousMonth.customers) / previousMonth.customers) * 100)
      : 0;

    // Calculate average monthly transactions
    const avgTransactions = Math.round(
      monthlyStats.reduce((sum, stat) => sum + stat.transactions, 0) / monthlyStats.length
    );

    // Calculate month-over-month transaction growth
    const transactionMonthGrowth = previousMonth.transactions > 0
      ? Math.round(((currentMonth.transactions - previousMonth.transactions) / previousMonth.transactions) * 100)
      : 0;

    // Calculate bank partner growth
    const bankGrowth = monthlyStats.length > 6
      ? monthlyStats[monthlyStats.length - 6].banks
      : firstMonth.banks;

    const bankGrowthChange = bankGrowth > 0
      ? currentMonth.banks - bankGrowth
      : 0;

    return {
      customerGrowth: `+${customerGrowthPercent}%`,
      customerGrowthChange: `${customerMonthGrowth >= 0 ? '+' : ''}${customerMonthGrowth}%`,
      avgMonthlyTransactions: avgTransactions.toLocaleString(),
      transactionGrowthChange: `${transactionMonthGrowth >= 0 ? '+' : ''}${transactionMonthGrowth}%`,
      totalBankPartners: currentMonth.banks.toString(),
      bankGrowthChange: bankGrowthChange > 0 ? `+${bankGrowthChange} new partners` : 'No new partners'
    };
  };

  const chartData = getChartData();
  const maxCustomers = Math.max(...chartData.map(d => d.customers), 1);
  const maxTransactions = Math.max(...chartData.map(d => d.transactions), 1);
  const growthStats = calculateGrowthStats();

  if (loading) {
    return (
      <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-theme-sm dark:border-blue-400 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Banking System Overview
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Customer growth and transaction volume trends
            </p>
          </div>
        </div>
        <div className="h-56 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-green-200 dark:border-blue-400">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Error loading system overview: {error}</p>
      </div>
    );
  }

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
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{growthStats.customerGrowth}</p>
          <p className="text-xs text-success-600 dark:text-success-400">↗ {growthStats.customerGrowthChange} this month</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Monthly Transactions</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{growthStats.avgMonthlyTransactions}</p>
          <p className="text-xs text-green-600 dark:text-green-400">↗ {growthStats.transactionGrowthChange} this month</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Bank Partners</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{growthStats.totalBankPartners}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">↗ {growthStats.bankGrowthChange}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
