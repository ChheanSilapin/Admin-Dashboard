
import { UsersIcon, BankIcon, ShieldIcon, CurrencyDollarIcon } from '../../icons';
import { useDashboard } from '../../hooks/useDashboard';

const RecentActivity = () => {
  const { dashboardData, loading, error } = useDashboard();

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      customer: {
        icon: <UsersIcon className="w-5 h-5" />,
        iconBg: 'bg-blue-100 dark:bg-blue-500/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
      },
      deposit: {
        icon: <CurrencyDollarIcon className="w-5 h-5" />,
        iconBg: 'bg-green-100 dark:bg-green-500/20',
        iconColor: 'text-green-600 dark:text-green-400',
      },
      withdrawal: {
        icon: <CurrencyDollarIcon className="w-5 h-5" />,
        iconBg: 'bg-yellow-100 dark:bg-yellow-500/20',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
      },
      bank: {
        icon: <BankIcon className="w-5 h-5" />,
        iconBg: 'bg-purple-100 dark:bg-purple-500/20',
        iconColor: 'text-purple-600 dark:text-purple-400',
      },
      role: {
        icon: <ShieldIcon className="w-5 h-5" />,
        iconBg: 'bg-orange-100 dark:bg-orange-500/20',
        iconColor: 'text-orange-600 dark:text-orange-400',
      },
      alert: {
        icon: <CurrencyDollarIcon className="w-5 h-5" />,
        iconBg: 'bg-red-100 dark:bg-red-500/20',
        iconColor: 'text-red-600 dark:text-red-400',
      },
    };

    return iconMap[type] || iconMap.customer;
  };

  const formatActivities = () => {
    const { activities } = dashboardData;

    if (!activities || activities.length === 0) {
      return [];
    }

    return activities.map(activity => {
      const iconData = getActivityIcon(activity.type);
      return {
        ...activity,
        time: formatTimeAgo(activity.created_at),
        ...iconData
      };
    });
  };

  const activities = formatActivities();

  if (loading) {
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
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-xl animate-pulse">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Error loading recent activities: {error}</p>
      </div>
    );
  }

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
