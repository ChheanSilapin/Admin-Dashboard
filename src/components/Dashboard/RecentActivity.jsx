
import { UsersIcon, BankIcon, ShieldIcon, CurrencyDollarIcon } from '../../icons';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'customer',
      title: 'New customer registered',
      description: 'John Doe created account #CU-2024-001',
      time: '2 minutes ago',
      icon: <UsersIcon className="w-5 h-5" />,
      iconBg: 'bg-blue-100 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 2,
      type: 'deposit',
      title: 'Deposit processed',
      description: '$2,500 USD deposit completed for customer #CU-2024-001',
      time: '5 minutes ago',
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
      iconBg: 'bg-green-100 dark:bg-green-500/20',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      id: 3,
      type: 'withdrawal',
      title: 'Withdrawal request',
      description: '៛820,000 KHR withdrawal pending approval',
      time: '12 minutes ago',
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
      iconBg: 'bg-yellow-100 dark:bg-yellow-500/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      id: 4,
      type: 'bank',
      title: 'New bank partner added',
      description: 'ABA Bank integration completed successfully',
      time: '25 minutes ago',
      icon: <BankIcon className="w-5 h-5" />,
      iconBg: 'bg-purple-100 dark:bg-purple-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      id: 5,
      type: 'role',
      title: 'User role assigned',
      description: 'Manager role granted to Sarah Wilson',
      time: '1 hour ago',
      icon: <ShieldIcon className="w-5 h-5" />,
      iconBg: 'bg-orange-100 dark:bg-orange-500/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      id: 6,
      type: 'alert',
      title: 'Large transaction alert',
      description: '$15,000 USD transaction flagged for compliance review',
      time: '3 hours ago',
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
      iconBg: 'bg-red-100 dark:bg-red-500/20',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Activity
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Latest system activities and updates
          </p>
        </div>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
          >
            <div className={`p-2.5 rounded-xl ${activity.iconBg} flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
              <div className={activity.iconColor}>
                {activity.icon}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {activity.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate leading-relaxed">
                {activity.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-center text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium py-2">
          Load More Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
