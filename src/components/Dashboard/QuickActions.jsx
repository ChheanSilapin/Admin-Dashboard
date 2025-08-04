
import { Link } from 'react-router-dom';
import { UsersIcon, BankIcon, ShieldIcon } from '../../icons';

const QuickActions = () => {
  const actions = [
    {
      title: 'Manage Customers',
      description: 'View and manage customer accounts',
      icon: <UsersIcon className="w-6 h-6" />,
      iconBg: 'bg-blue-100 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      link: '/customers',
      buttonText: 'View Customers',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
    },
    {
      title: 'Add New Bank',
      description: 'Register a new banking partner',
      icon: <BankIcon className="w-6 h-6" />,
      iconBg: 'bg-green-100 dark:bg-green-500/20',
      iconColor: 'text-green-600 dark:text-green-400',
      link: '/banks/add',
      buttonText: 'Add Bank',
      buttonColor: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
    },
  ];

  return (
    <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Quick Actions
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Common administrative tasks
          </p>
        </div>

        <div className="space-y-4 pb-4">
          {actions.map((action, index) => (
            <div
              key={index}
              className="border border-green-200 dark:border-gray-700 rounded-xl p-3 hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-3 rounded-xl ${action.iconBg} flex-shrink-0`}>
                  <div className={action.iconColor}>
                    {action.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
                    {action.description}
                  </p>
                  <Link
                    to={action.link}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-all duration-200 hover:shadow-sm ${action.buttonColor}`}
                  >
                    {action.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default QuickActions;
