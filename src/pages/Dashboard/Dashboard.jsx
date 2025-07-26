
import MetricsCards from '../../components/Dashboard/MetricsCards';
import RecentActivity from '../../components/Dashboard/RecentActivity';
import QuickActions from '../../components/Dashboard/QuickActions';
import SystemOverview from '../../components/Dashboard/SystemOverview';
import SystemStatus from '../../components/Dashboard/SystemStatus';

const Dashboard = () => {

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Row 1: Metrics Cards - Full Width */}
      <div className="col-span-12">
        <MetricsCards />
      </div>

      {/* Row 2: Banking System Overview - Full Width */}
      <div className="col-span-12">
        <SystemOverview />
      </div>

      {/* Row 3: System Status (Left) + Quick Actions (Right) */}
      <div className="col-span-12 xl:col-span-6">
        <SystemStatus />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <QuickActions />
      </div>

      {/* Row 4: Recent Activity - Full Width */}
      <div className="col-span-12">
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;