import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export type SeverityLevel = 'critical' | 'major' | 'minor' | 'site-down';

export interface Alarm {
  id: string;
  severity: SeverityLevel;
  active: string;
  siteName: string;
  event: string;
  region: string;
  project: string;
  acknowledgedAt: string | null;
  startTime: string;
  endTime: string | null;
  elapsedTime: string;
  tags: string[];
}

interface AlarmState {
  alarms: Alarm[];
  filteredAlarms: Alarm[];
  favorites: string[];
  searchTerm: string;
  showFavoritesOnly: boolean;
  loading: boolean;
  error: string | null;
}

// Mock alarm data
const mockAlarms: Alarm[] = [
  {
    id: '1',
    severity: 'site-down',
    active: 'Site Down',
    siteName: 'ES2-JCA-07913',
    event: 'Communication Lost',
    region: 'Central',
    project: '829',
    acknowledgedAt: null,
    startTime: '2025-12-08 18:39:47',
    endTime: null,
    elapsedTime: '0:00:02',
    tags: ['ATW', 'PMBotch0', 'AUOSCOPE', 'DSE7320MKL', 'ACCUMA', 'VEI'],
  },
  {
    id: '2',
    severity: 'site-down',
    active: 'Site Down',
    siteName: 'ES2-HYD-0795B',
    event: 'South I',
    region: 'B2S',
    project: '',
    acknowledgedAt: null,
    startTime: '2025-12-08 18:38:47',
    endTime: null,
    elapsedTime: '0:00:02',
    tags: [],
  },
  {
    id: '3',
    severity: 'critical',
    active: 'Site Down',
    siteName: 'EC2-RYK-0871G',
    event: 'Central B',
    region: 'B25-Solar',
    project: '',
    acknowledgedAt: null,
    startTime: '2025-12-08 10:38:45',
    endTime: null,
    elapsedTime: '0:00:04',
    tags: [],
  },
  {
    id: '4',
    severity: 'major',
    active: 'Warning',
    siteName: 'ES2-CON-00070',
    event: 'High Temperature',
    region: 'East',
    project: '',
    acknowledgedAt: null,
    startTime: '2025-12-06 18:39:44',
    endTime: null,
    elapsedTime: '0:00:05',
    tags: ['PMBotch0L', 'AUGSCOPE', 'PMSEP', 'MSIK', 'DSE7320MKIL', 'ACCU'],
  },
  {
    id: '5',
    severity: 'minor',
    active: 'No Load',
    siteName: 'ES2-LHR-00013',
    event: 'South I',
    region: 'Jorz AC Metering',
    project: '',
    acknowledgedAt: null,
    startTime: '2025-12-08 10:38:35',
    endTime: null,
    elapsedTime: '0:00:04',
    tags: [],
  },
  {
    id: '6',
    severity: 'critical',
    active: 'Fault',
    siteName: 'ES2-KHI-08821',
    event: 'Inverter Fault',
    region: 'South',
    project: '124',
    acknowledgedAt: '2025-12-08 11:00:00',
    startTime: '2025-12-08 10:30:00',
    endTime: null,
    elapsedTime: '0:30:00',
    tags: ['INVERTER', 'FAULT', 'PRIORITY'],
  },
  {
    id: '7',
    severity: 'major',
    active: 'Alert',
    siteName: 'ES2-ISB-00456',
    event: 'Battery Low',
    region: 'North',
    project: '567',
    acknowledgedAt: null,
    startTime: '2025-12-08 09:15:00',
    endTime: null,
    elapsedTime: '1:24:47',
    tags: ['BATTERY', 'LOW'],
  },
  {
    id: '8',
    severity: 'minor',
    active: 'Info',
    siteName: 'ES2-LHR-00789',
    event: 'Scheduled Maintenance',
    region: 'Central',
    project: '890',
    acknowledgedAt: '2025-12-08 08:00:00',
    startTime: '2025-12-08 08:00:00',
    endTime: '2025-12-08 12:00:00',
    elapsedTime: '4:00:00',
    tags: ['MAINTENANCE', 'SCHEDULED'],
  },
];

export const fetchAlarms = createAsyncThunk(
  'alarm/fetchAlarms',
  async (searchTerm: string = '') => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!searchTerm) return mockAlarms;
    
    const term = searchTerm.toLowerCase();
    return mockAlarms.filter(alarm => 
      alarm.siteName.toLowerCase().includes(term) ||
      alarm.event.toLowerCase().includes(term) ||
      alarm.region.toLowerCase().includes(term) ||
      alarm.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }
);

const initialState: AlarmState = {
  alarms: [],
  filteredAlarms: [],
  favorites: [],
  searchTerm: '',
  showFavoritesOnly: false,
  loading: false,
  error: null,
};

const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const alarmId = action.payload;
      if (state.favorites.includes(alarmId)) {
        state.favorites = state.favorites.filter(id => id !== alarmId);
      } else {
        state.favorites.push(alarmId);
      }
      // Update filtered alarms if showing favorites only
      if (state.showFavoritesOnly) {
        state.filteredAlarms = state.alarms.filter(a => state.favorites.includes(a.id));
      }
    },
    toggleShowFavoritesOnly: (state) => {
      state.showFavoritesOnly = !state.showFavoritesOnly;
      if (state.showFavoritesOnly) {
        state.filteredAlarms = state.alarms.filter(a => state.favorites.includes(a.id));
      } else {
        state.filteredAlarms = state.alarms;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlarms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlarms.fulfilled, (state, action: PayloadAction<Alarm[]>) => {
        state.loading = false;
        state.alarms = action.payload;
        if (state.showFavoritesOnly) {
          state.filteredAlarms = action.payload.filter(a => state.favorites.includes(a.id));
        } else {
          state.filteredAlarms = action.payload;
        }
      })
      .addCase(fetchAlarms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch alarms';
      });
  },
});

export const { setSearchTerm, toggleFavorite, toggleShowFavoritesOnly } = alarmSlice.actions;
export default alarmSlice.reducer;
