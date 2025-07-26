const SystemStatus = () => {
  const stats = [
    { label: 'Active Users', value: '1,234', change: '+12%', positive: true },
    { label: 'Pending Transactions', value: '23', change: '-5%', positive: false },
    { label: 'System Uptime', value: '99.9%', change: '+0.1%', positive: true },
    { label: 'Daily Transactions', value: '456', change: '+8%', positive: true },
  ];

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
