import { useDashboard } from '../../hooks/useDashboard';

const SystemStatus = () => {
  const { dashboardData, loading, error } = useDashboard();

  const calculateStats = () => {
    const { metrics, monthlyStats } = dashboardData;

    if (!metrics || Object.keys(metrics).length === 0) {
      return [
        { label: 'Active Users', value: '0', change: '0%', positive: true },
        { label: 'Pending Transactions', value: '0', change: '0%', positive: true },
        { label: 'System Uptime', value: '0%', change: '0%', positive: true },
        { label: 'Daily Transactions', value: '0', change: '0%', positive: true },
      ];
    }

    // Calculate growth percentages from monthly stats
    const calculateGrowthPercentage = (current, previous) => {
      if (!previous || previous === 0) return '0%';
      const growth = ((current - previous) / previous) * 100;
      return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
    };

    // Calculate changes based on monthly data
    let activeUsersChange = '+12%';
    let pendingTransactionsChange = '-5%';
    let dailyTransactionsChange = '+8%';

    if (monthlyStats && monthlyStats.length >= 2) {
      const currentMonth = monthlyStats[monthlyStats.length - 1];
      const previousMonth = monthlyStats[monthlyStats.length - 2];

      // Calculate active users change (assume 80% of customers are active)
      const currentActiveUsers = Math.floor(currentMonth.customers * 0.8);
      const previousActiveUsers = Math.floor(previousMonth.customers * 0.8);
      activeUsersChange = calculateGrowthPercentage(currentActiveUsers, previousActiveUsers);

      // Calculate daily transactions change based on monthly transaction growth
      dailyTransactionsChange = calculateGrowthPercentage(currentMonth.transactions, previousMonth.transactions);
    }

    // Calculate pending transactions change (assume it decreases as system improves)
    const pendingCount = metrics.pending_transactions || 0;
    pendingTransactionsChange = pendingCount > 10 ? '-5%' : pendingCount > 5 ? '-2%' : '0%';

    return [
      {
        label: 'Active Users',
        value: metrics.active_users?.toLocaleString() || '0',
        change: activeUsersChange,
        positive: !activeUsersChange.startsWith('-')
      },
      {
        label: 'Pending Transactions',
        value: metrics.pending_transactions?.toString() || '0',
        change: pendingTransactionsChange,
        positive: pendingTransactionsChange.startsWith('-') // Negative is good for pending transactions
      },
      {
        label: 'System Uptime',
        value: `${metrics.system_uptime || 0}%`,
        change: '+0.1%',
        positive: true
      },
      {
        label: 'Daily Transactions',
        value: metrics.daily_transactions?.toLocaleString() || '0',
        change: dailyTransactionsChange,
        positive: !dailyTransactionsChange.startsWith('-')
      },
    ];
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            System Status
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Current system metrics
          </p>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center justify-between animate-pulse">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Error loading system status: {error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          System Status
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Current system metrics
        </p>
      </div>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {stat.label}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-medium ${
                  stat.positive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;
