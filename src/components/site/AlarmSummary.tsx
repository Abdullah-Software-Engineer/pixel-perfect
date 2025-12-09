import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  label: string;
  value: number;
  colorClass: string;
}

function SummaryCard({ label, value, colorClass }: SummaryCardProps) {
  return (
    <div className="flex flex-col">
      <div className={cn('py-1.5 px-4 text-center text-sm font-medium text-white rounded-t', colorClass)}>
        {label}
      </div>
      <div className="py-4 text-center bg-card border border-t-0 border-border rounded-b">
        <span className="text-3xl font-bold font-mono text-foreground">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

export function AlarmSummary() {
  const { alarmSummary } = useAppSelector(state => state.site);

  return (
    <div className="glass-panel p-4 animate-fade-in">
      <h2 className="text-lg font-semibold text-foreground mb-4">Alarm Summary</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <SummaryCard 
          label="Site Down" 
          value={alarmSummary.siteDown} 
          colorClass="bg-severity-site-down"
        />
        <SummaryCard 
          label="Critical" 
          value={alarmSummary.critical} 
          colorClass="bg-severity-critical"
        />
        <SummaryCard 
          label="Major" 
          value={alarmSummary.major} 
          colorClass="bg-severity-major"
        />
        <SummaryCard 
          label="Minor" 
          value={alarmSummary.minor} 
          colorClass="bg-severity-minor"
        />
      </div>
    </div>
  );
}
