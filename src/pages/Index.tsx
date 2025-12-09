import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LiveChart } from '@/components/dashboard/LiveChart';
import { AlarmsTable } from '@/components/dashboard/AlarmsTable';

const Index = () => {
  return (
    <DashboardLayout title="Energy Dashboard" breadcrumb="Overview">
      <div className="space-y-6">
        <LiveChart />
        <AlarmsTable />
      </div>
    </DashboardLayout>
  );
};

export default Index;
