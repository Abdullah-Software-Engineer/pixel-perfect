import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export type SeverityLevel = 'critical' | 'major' | 'minor' | 'site-down';

export interface Alarm {
  id: string;
  severity: SeverityLevel;
  active: boolean;
  siteName: string;
  event: string;
  region: string;
  project: string;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
  startTime: string;
  endTime: string | null;
  elapsedTime: string;
  t1: string | null;
  t2: string | null;
  t3: string | null;
  t4: string | null;
  t1Id: string | null;
  t2Id: string | null;
  t3Id: string | null;
  t4Id: string | null;
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
    active: true,
    siteName: 'ES2-JCA-07913',
    event: 'Load Disconnected',
    region: 'South I',
    project: '825',
    acknowledgedBy: null,
    acknowledgedAt: null,
    startTime: '2025-12-08 18:39:47',
    endTime: null,
    elapsedTime: '0:00:02',
    t1: 'Ufone',
    t2: 'Jazz',
    t3: 'Zong',
    t4: 'Telenor',
    t1Id: '52808',
    t2Id: '61283',
    t3Id: 'RAN1380',
    t4Id: 'N-5702',
    tags: ['ATW', 'PMBatch01', 'AUGSCOPE', 'DSE7320MKII', 'ACCUMIA', 'VER'],
  },
  {
    id: '2',
    severity: 'site-down',
    active: true,
    siteName: 'ES2-HYD-07966',
    event: 'Site Down',
    region: 'Central B',
    project: '825-Solar',
    acknowledgedBy: null,
    acknowledgedAt: null,
    startTime: '2025-12-08 18:39:45',
    endTime: null,
    elapsedTime: '0:00:04',
    t1: 'Safaricom',
    t2: 'Vacant',
    t3: null,
    t4: null,
    t1Id: '8-3007',
    t2Id: null,
    t3Id: null,
    t4Id: null,
    tags: ['PMBatch01', 'ACCUMIA', 'MSAS', 'VERTIVIA', 'TPMMOST'],
  },
  {
    id: '3',
    severity: 'critical',
    active: true,
    siteName: 'EC2-RYK-08716',
    event: 'Battery Discharging',
    region: 'Kitale',
    project: 'Jazz AC Metering',
    acknowledgedBy: null,
    acknowledgedAt: null,
    startTime: '2025-12-08 18:39:35',
    endTime: null,
    elapsedTime: '0:00:05',
    t1: 'Jazz',
    t2: null,
    t3: null,
    t4: null,
    t1Id: '??',
    t2Id: null,
    t3Id: null,
    t4Id: null,
    tags: ['MEGMPSU', 'DSEBRO'],
  },
  {
    id: '4',
    severity: 'major',
    active: true,
    siteName: 'ES2-BDN-00078',
    event: 'Genset Running',
    region: 'North',
    project: '825',
    acknowledgedBy: null,
    acknowledgedAt: null,
    startTime: '2025-12-08 18:39:33',
    endTime: null,
    elapsedTime: '0:00:06',
    t1: 'Ufone',
    t2: 'Jazz',
    t3: null,
    t4: null,
    t1Id: '52808',
    t2Id: '61283',
    t3Id: null,
    t4Id: null,
    tags: ['SIMIS', 'ATW', 'ACCUMIA', 'MSAS', 'MDPE', 'MDPR', 'TPMMOI'],
  },
  {
    id: '5',
    severity: 'minor',
    active: true,
    siteName: 'Kobolet',
    event: 'Mains Fall',
    region: 'South I',
    project: '825',
    acknowledgedBy: null,
    acknowledgedAt: null,
    startTime: '2025-12-08 18:39:31',
    endTime: null,
    elapsedTime: '0:00:08',
    t1: null,
    t2: null,
    t3: null,
    t4: null,
    t1Id: null,
    t2Id: null,
    t3Id: null,
    t4Id: null,
    tags: ['EMMIA'],
  },
  {
    id: '6',
    severity: 'site-down',
    active: true,
    siteName: 'Kobolet',
    event: 'Bus Voltage Low',
    region: 'Central B',
    project: '825-Solar',
    acknowledgedBy: null,
    acknowledgedAt: null,
    startTime: '2025-12-08 18:39:29',
    endTime: null,
    elapsedTime: '0:00:11',
    t1: 'Jazz',
    t2: 'Zong',
    t3: null,
    t4: null,
    t1Id: '61283',
    t2Id: 'RAN1380',
    t3Id: null,
    t4Id: null,
    tags: ['PMBatch01', 'ACCUMIA'],
  },
  {
    id: '7',
    severity: 'critical',
    active: true,
    siteName: 'ES2-KSH-01748',
    event: 'L3 No Load',
    region: 'Kitale',
    project: 'Jazz AC Metering',
    acknowledgedBy: null,
    acknowledgedAt: null,
    startTime: '2025-12-08 18:39:27',
    endTime: null,
    elapsedTime: '0:00:13',
    t1: 'Ufone',
    t2: null,
    t3: null,
    t4: null,
    t1Id: '52808',
    t2Id: null,
    t3Id: null,
    t4Id: null,
    tags: ['ATW', 'PMBatch01'],
  },
  {
    id: '8',
    severity: 'major',
    active: true,
    siteName: 'ENI-68-04144',
    event: 'Load Disconnected',
    region: 'North',
    project: '825',
    acknowledgedBy: null,
    acknowledgedAt: null,
    startTime: '2025-12-08 18:39:25',
    endTime: null,
    elapsedTime: '0:00:14',
    t1: 'Telenor',
    t2: 'Safaricom',
    t3: null,
    t4: null,
    t1Id: 'N-5702',
    t2Id: '8-3007',
    t3Id: null,
    t4Id: null,
    tags: ['DSE7320MKII', 'ACCUMIA'],
  },
  {
    id: '9',
    severity: 'site-down',
    active: true,
    siteName: 'ESI-10-05674',
    event: 'Site Down',
    region: 'South I',
    project: '825-Solar',
    acknowledgedBy: null,
    acknowledgedAt: null,
    startTime: '2025-12-08 18:39:23',
    endTime: null,
    elapsedTime: '0:00:16',
    t1: 'Zong',
    t2: null,
    t3: null,
    t4: null,
    t1Id: 'RAN1380',
    t2Id: null,
    t3Id: null,
    t4Id: null,
    tags: ['MSAS', 'VERTIVIA'],
  },
  {
    id: '10',
    severity: 'minor',
    active: true,
    siteName: 'K-49655',
    event: 'Battery Discharging',
    region: 'Central B',
    project: 'Jazz AC Metering',
    acknowledgedBy: null,
    acknowledgedAt: null,
    startTime: '2025-12-08 18:39:21',
    endTime: null,
    elapsedTime: '0:00:18',
    t1: 'Ufone',
    t2: 'Jazz',
    t3: 'Zong',
    t4: null,
    t1Id: '52808',
    t2Id: '61283',
    t3Id: 'RAN1380',
    t4Id: null,
    tags: ['TPMMOST', 'DSEBRO'],
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
