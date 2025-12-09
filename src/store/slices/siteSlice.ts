import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export type OperatingMode = 'Grid Following' | 'Microgrid' | 'Standalone';

export interface EnergyData {
  date: string;
  solar: number;
  grid: number;
}

export interface SiteInfo {
  id: string;
  name: string;
  location: string;
  mode: OperatingMode;
}

export interface AlarmSummary {
  siteDown: number;
  critical: number;
  major: number;
  minor: number;
}

interface SiteState {
  siteInfo: SiteInfo | null;
  energyStats: EnergyData[];
  totalEnergy: number;
  solarTotal: number;
  gridTotal: number;
  alarmSummary: AlarmSummary;
  loading: boolean;
  error: string | null;
}

// Mock site data
const mockSiteInfo: SiteInfo = {
  id: 'site-001',
  name: 'Bean Energy Limited',
  location: 'Central Region',
  mode: 'Grid Following',
};

// Generate mock energy data for the past 30 days
const generateEnergyData = (): EnergyData[] => {
  const data: EnergyData[] = [];
  const baseDate = new Date('2025-11-09');
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random variations in energy production
    const solar = Math.round((10 + Math.random() * 15) * 100) / 100;
    const grid = Math.round((55 + Math.random() * 30) * 100) / 100;
    
    data.push({ date: dateStr, solar, grid });
  }
  
  return data;
};

const mockEnergyData = generateEnergyData();
const solarTotal = mockEnergyData.reduce((sum, d) => sum + d.solar, 0);
const gridTotal = mockEnergyData.reduce((sum, d) => sum + d.grid, 0);

export const fetchSiteData = createAsyncThunk(
  'site/fetchSiteData',
  async (siteId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      siteInfo: { ...mockSiteInfo, id: siteId },
      energyStats: mockEnergyData,
      totalEnergy: Math.round(solarTotal + gridTotal),
      solarTotal: Math.round(solarTotal * 100) / 100,
      gridTotal: Math.round(gridTotal * 100) / 100,
      alarmSummary: {
        siteDown: 0,
        critical: 0,
        major: 0,
        minor: 0,
      },
    };
  }
);

const initialState: SiteState = {
  siteInfo: null,
  energyStats: [],
  totalEnergy: 0,
  solarTotal: 0,
  gridTotal: 0,
  alarmSummary: {
    siteDown: 0,
    critical: 0,
    major: 0,
    minor: 0,
  },
  loading: false,
  error: null,
};

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    setOperatingMode: (state, action: PayloadAction<OperatingMode>) => {
      if (state.siteInfo) {
        state.siteInfo.mode = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteData.fulfilled, (state, action) => {
        state.loading = false;
        state.siteInfo = action.payload.siteInfo;
        state.energyStats = action.payload.energyStats;
        state.totalEnergy = action.payload.totalEnergy;
        state.solarTotal = action.payload.solarTotal;
        state.gridTotal = action.payload.gridTotal;
        state.alarmSummary = action.payload.alarmSummary;
      })
      .addCase(fetchSiteData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch site data';
      });
  },
});

export const { setOperatingMode } = siteSlice.actions;
export default siteSlice.reducer;
