
import { useCurrency } from '../../contexts/CurrencyContext';
import { UsersIcon, BankIcon, CurrencyDollarIcon, ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from '../../icons';
import Badge from '../ui/Badge';
import { useDashboard } from '../../hooks/useDashboard';

const MetricsCards = () => {
  const { currentCurrency, currencies } = useCurrency();
  const { dashboardData, loading, error } = useDashboard();

  // Format amount without currency conversion (amount is already in correct currency)
  const formatAmountWithoutConversion = (amount, currencyCode) => {
    const currency = currencies[currencyCode];
    if (!currency) return amount;

    // Format with appropriate decimal places without conversion
    const decimals = currencyCode === 'KHR' ? 0 : 2;
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);

    return `${currency.symbol}${formatted}`;
  };

  // Calculate metrics from real data with growth percentages
  const calculateMetrics = () => {
    const { metrics, monthlyStats } = dashboardData;

    if (!metrics || Object.keys(metrics).length === 0) {
      return [
        {
          title: 'Total Customers',
          value: '0',
          change: '0%',
          changeType: 'positive',
          icon: <UsersIcon className="w-6 h-6" />,
          description: 'Active customer accounts',
        },
        {
          title: 'Total Transactions',
          value: '0',
          change: '0%',
          changeType: 'positive',
          icon: <CurrencyDollarIcon className="w-6 h-6" />,
          description: 'Completed transactions',
        },
        {
          title: 'Active Banks',
          value: '0',
          change: '0%',
          changeType: 'positive',
          icon: <BankIcon className="w-6 h-6" />,
          description: 'Partner banking institutions',
        },
        {
          title: `Transaction Volume (${currentCurrency})`,
          value: formatAmountWithoutConversion(0, currentCurrency),
          change: '0%',
          changeType: 'positive',
          icon: <TrendingUpIcon className="w-6 h-6" />,
          description: 'Total transaction volume',
        },
      ];
    }

    // Calculate growth percentages from monthly stats
    const calculateGrowthPercentage = (current, previous) => {
      if (!previous || previous === 0) return '0%';
      const growth = ((current - previous) / previous) * 100;
      return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
    };

    const getChangeType = (current, previous) => {
      return current >= previous ? 'positive' : 'negative';
    };

    // Get current and previous month data for growth calculation
    let customerGrowth = '0%';
    let transactionGrowth = '0%';
    let bankGrowth = '0%';
    let volumeGrowth = '0%';
    let customerChangeType = 'positive';
    let transactionChangeType = 'positive';
    let bankChangeType = 'positive';
    let volumeChangeType = 'positive';

    if (monthlyStats && monthlyStats.length >= 2) {
      const currentMonth = monthlyStats[monthlyStats.length - 1];
      const previousMonth = monthlyStats[monthlyStats.length - 2];

      customerGrowth = calculateGrowthPercentage(currentMonth.customers, previousMonth.customers);
      transactionGrowth = calculateGrowthPercentage(currentMonth.transactions, previousMonth.transactions);
      bankGrowth = calculateGrowthPercentage(currentMonth.banks, previousMonth.banks);

      const currentVolume = currentCurrency === 'USD'
        ? currentMonth.transaction_volume_usd
        : currentMonth.transaction_volume_khr;
      const previousVolume = currentCurrency === 'USD'
        ? previousMonth.transaction_volume_usd
        : previousMonth.transaction_volume_khr;

      volumeGrowth = calculateGrowthPercentage(currentVolume, previousVolume);

      customerChangeType = getChangeType(currentMonth.customers, previousMonth.customers);
      transactionChangeType = getChangeType(currentMonth.transactions, previousMonth.transactions);
      bankChangeType = getChangeType(currentMonth.banks, previousMonth.banks);
      volumeChangeType = getChangeType(currentVolume, previousVolume);
    }

    // Get transaction volume in the selected currency (already in correct currency from API)
    const transactionVolume = currentCurrency === 'USD'
      ? metrics.transaction_volume_usd || 0
      : metrics.transaction_volume_khr || 0;

    return [
      {
        title: 'Total Customers',
        value: metrics.total_customers?.toLocaleString() || '0',
        change: customerGrowth,
        changeType: customerChangeType,
        icon: <UsersIcon className="w-6 h-6" />,
        description: 'Active customer accounts',
      },
      {
        title: 'Total Transactions',
        value: metrics.total_transactions?.toLocaleString() || '0',
        change: transactionGrowth,
        changeType: transactionChangeType,
        icon: <CurrencyDollarIcon className="w-6 h-6" />,
        description: 'Completed transactions',
      },
      {
        title: 'Active Banks',
        value: metrics.active_banks?.toString() || '0',
        change: bankGrowth,
        changeType: bankChangeType,
        icon: <BankIcon className="w-6 h-6" />,
        description: 'Partner banking institutions',
      },
      {
        title: `Transaction Volume (${currentCurrency})`,
        value: formatAmountWithoutConversion(transactionVolume, currentCurrency),
        change: volumeGrowth,
        changeType: volumeChangeType,
        icon: <TrendingUpIcon className="w-6 h-6" />,
        description: 'Total transaction volume',
      },
    ];
  };

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-green-200 bg-white p-5 shadow-theme-sm dark:border-blue-400 dark:bg-white/[0.03] md:p-6 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-5"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Error loading metrics: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="rounded-2xl border border-green-200 bg-white p-5 shadow-theme-sm dark:border-blue-400 dark:bg-white/[0.03] md:p-6"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 border border-green-200 dark:border-blue-400">
            <div className="text-green-400 dark:text-blue-400">
              {metric.icon}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-3">
              <span className="text-sm text-gray-500 dark:text-white">
                {metric.title}
              </span>
              <h4 className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value}
              </h4>
              {metric.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {metric.description}
                </p>
              )}
            </div>
            <Badge
              color={metric.changeType === 'positive' ? 'success' : 'error'}
              startIcon={metric.changeType === 'positive' ? <ArrowUpIcon /> : <ArrowDownIcon />}
              size="sm"
            >
              {metric.change}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;
