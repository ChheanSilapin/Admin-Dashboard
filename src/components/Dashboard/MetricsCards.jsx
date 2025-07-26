
import { useCurrency } from '../../contexts/CurrencyContext';
import { UsersIcon, BankIcon, CurrencyDollarIcon, ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from '../../icons';
import Badge from '../ui/Badge';

const MetricsCards = () => {
  const { formatAmount, currentCurrency } = useCurrency();

  const metrics = [
    {
      title: 'Total Customers',
      value: '3,782',
      change: '11.01%',
      changeType: 'positive',
      icon: <UsersIcon className="w-6 h-6" />,
      description: 'Active customer accounts',
    },
    {
      title: 'Total Transactions',
      value: '12,459',
      change: '8.3%',
      changeType: 'positive',
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      description: 'Completed transactions',
    },
    {
      title: 'Active Banks',
      value: '24',
      change: '2.1%',
      changeType: 'positive',
      icon: <BankIcon className="w-6 h-6" />,
      description: 'Partner banking institutions',
    },
    {
      title: `Transaction Volume (${currentCurrency})`,
      value: currentCurrency === 'USD' ? formatAmount(2847500) : formatAmount(2847500),
      change: '15.7%',
      changeType: 'positive',
      icon: <TrendingUpIcon className="w-6 h-6" />,
      description: 'Total transaction volume',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <div className="text-gray-800 dark:text-white/90">
              {metric.icon}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
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
