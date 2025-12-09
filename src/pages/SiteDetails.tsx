import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSiteData } from '@/store/slices/siteSlice';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EnergyChart } from '@/components/site/EnergyChart';
import { AlarmSummary } from '@/components/site/AlarmSummary';
import { TicketDrawer } from '@/components/site/TicketDrawer';
import { Badge } from '@/components/ui/badge';
import { MapPin, Radio, Loader2 } from 'lucide-react';

const SiteDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { siteInfo, loading, error } = useAppSelector(state => state.site);

  useEffect(() => {
    if (id) {
      dispatch(fetchSiteData(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <DashboardLayout title="Site Details" breadcrumb="Loading...">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading site data...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !siteInfo) {
    return (
      <DashboardLayout title="Site Details" breadcrumb="Error">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <p className="text-destructive mb-2">Failed to load site data</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={siteInfo.name} breadcrumb={siteInfo.name}>
      <div className="space-y-6">
        {/* Site Header */}
        <div className="glass-panel p-4 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{siteInfo.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-chart-grid" />
              <Badge variant="outline" className="font-mono">
                {siteInfo.mode}
              </Badge>
            </div>
          </div>
          <TicketDrawer siteId={siteInfo.id} siteName={siteInfo.name} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnergyChart />
          </div>
          <div>
            <AlarmSummary />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SiteDetails;
