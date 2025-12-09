import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface PowerDataPoint {
  timestamp: number;
  activePower: number;
  reactivePower: number;
}

interface PowerState {
  currentPower: {
    active: number;
    reactive: number;
  };
  chartData: PowerDataPoint[];
  isPolling: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: PowerState = {
  currentPower: { active: 0, reactive: 0 },
  chartData: [],
  isPolling: false,
  loading: false,
  error: null,
};

// Mock API that generates sinusoidal power data
export const fetchLivePowerData = createAsyncThunk(
  'power/fetchLiveData',
  async (_, { getState }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const state = getState() as { power: PowerState };
    const lastTimestamp = state.power.chartData.length > 0 
      ? state.power.chartData[state.power.chartData.length - 1].timestamp 
      : Date.now();
    
    // Generate 20 new sinusoidal data points
    const newData: PowerDataPoint[] = [];
    for (let i = 0; i < 20; i++) {
      const timestamp = lastTimestamp + (i + 1) * 3000; // 3 second intervals
      const time = timestamp / 1000;
      const activePower = 75 * Math.sin(time * 0.1) + (Math.random() - 0.5) * 10;
      const reactivePower = 50 * Math.sin(time * 0.1 + Math.PI / 4) + (Math.random() - 0.5) * 8;
      newData.push({ timestamp, activePower, reactivePower });
    }
    
    return newData;
  }
);

const powerSlice = createSlice({
  name: 'power',
  initialState,
  reducers: {
    startPolling: (state) => {
      state.isPolling = true;
    },
    stopPolling: (state) => {
      state.isPolling = false;
    },
    clearChartData: (state) => {
      state.chartData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLivePowerData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLivePowerData.fulfilled, (state, action: PayloadAction<PowerDataPoint[]>) => {
        state.loading = false;
        const newData = action.payload;
        
        // Append new data
        state.chartData = [...state.chartData, ...newData];
        
        // Keep only last 100 points
        if (state.chartData.length > 100) {
          state.chartData = state.chartData.slice(-100);
        }
        
        // Update current power with latest values
        if (newData.length > 0) {
          const latest = newData[newData.length - 1];
          state.currentPower = {
            active: latest.activePower,
            reactive: latest.reactivePower,
          };
        }
      })
      .addCase(fetchLivePowerData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch power data';
      });
  },
});

export const { startPolling, stopPolling, clearChartData } = powerSlice.actions;
export default powerSlice.reducer;
