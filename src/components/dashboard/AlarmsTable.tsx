import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAlarms, setSearchTerm, toggleFavorite, toggleShowFavoritesOnly, SeverityLevel } from '@/store/slices/alarmSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Star, StarOff, Filter, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const severityStyles: Record<SeverityLevel, string> = {
  'critical': 'severity-critical',
  'major': 'severity-major',
  'minor': 'severity-minor',
  'site-down': 'severity-site-down',
};

const severityLabels: Record<SeverityLevel, string> = {
  'critical': 'Critical',
  'major': 'Major',
  'minor': 'Minor',
  'site-down': 'Site Down',
};

export function AlarmsTable() {
  const dispatch = useAppDispatch();
  const { filteredAlarms, favorites, showFavoritesOnly, loading, searchTerm } = useAppSelector(state => state.alarm);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  
  const debouncedSearch = useDebounce(localSearch, 400);

  // Fetch alarms when debounced search term changes
  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearch));
    dispatch(fetchAlarms(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchAlarms(''));
  }, [dispatch]);

  const handleToggleFavorite = (alarmId: string) => {
    dispatch(toggleFavorite(alarmId));
  };

  const handleToggleFilter = () => {
    dispatch(toggleShowFavoritesOnly());
  };

  return (
    <div className="glass-panel animate-fade-in">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Events</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={showFavoritesOnly ? 'default' : 'secondary'}
              size="sm"
              onClick={handleToggleFilter}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFavoritesOnly ? 'Favorites' : 'All Alarms'}
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by site name, event, or tags..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-10"></TableHead>
              <TableHead className="w-24">Severity</TableHead>
              <TableHead className="w-24">Active</TableHead>
              <TableHead>Site Name</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Elapsed</TableHead>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Loading alarms...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAlarms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  {showFavoritesOnly ? 'No favorite alarms' : 'No alarms found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAlarms.map((alarm) => (
                <TableRow 
                  key={alarm.id} 
                  className="border-border hover:bg-secondary/30 transition-colors"
                >
                  <TableCell>
                    <button
                      onClick={() => handleToggleFavorite(alarm.id)}
                      className="p-1 rounded hover:bg-secondary transition-colors"
                    >
                      {favorites.includes(alarm.id) ? (
                        <Star className="w-4 h-4 text-chart-solar fill-chart-solar" />
                      ) : (
                        <StarOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <span className={cn('severity-badge', severityStyles[alarm.severity])}>
                      {severityLabels[alarm.severity]}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {alarm.active}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground">
                    {alarm.siteName}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {alarm.event}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {alarm.region}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {alarm.startTime}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground font-mono">
                      <Clock className="w-3 h-3" />
                      {alarm.elapsedTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {alarm.tags.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {alarm.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{alarm.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
