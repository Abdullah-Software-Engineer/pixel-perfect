import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface MaintenanceTicket {
  id: string;
  woTemplate: string;
  site: string;
  zone: string;
  region: string;
  clusterId: string;
  hubSite: string;
  templateName: string;
  assignee: string;
  subject: string;
  activityPerformer: string;
  serviceImpact: string;
  opcat1: string;
  opcat2: string;
  plannedStartTime: string;
  plannedEndTime: string;
  createdAt: string;
  status: 'draft' | 'submitted' | 'in-progress' | 'completed';
}

interface MaintenanceState {
  tickets: MaintenanceTicket[];
  submitting: boolean;
  lastSubmitted: MaintenanceTicket | null;
  error: string | null;
}

export const submitTicket = createAsyncThunk(
  'maintenance/submitTicket',
  async (ticket: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Failed to submit ticket. Please try again.');
    }
    
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `WO-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'submitted',
    };
    
    return newTicket;
  }
);

const initialState: MaintenanceState = {
  tickets: [],
  submitting: false,
  lastSubmitted: null,
  error: null,
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastSubmitted: (state) => {
      state.lastSubmitted = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitTicket.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitTicket.fulfilled, (state, action: PayloadAction<MaintenanceTicket>) => {
        state.submitting = false;
        state.tickets.push(action.payload);
        state.lastSubmitted = action.payload;
      })
      .addCase(submitTicket.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.error.message || 'Failed to submit ticket';
      });
  },
});

export const { clearError, clearLastSubmitted } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
