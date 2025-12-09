import { configureStore } from '@reduxjs/toolkit';
import powerReducer from './slices/powerSlice';
import alarmReducer from './slices/alarmSlice';
import siteReducer from './slices/siteSlice';
import maintenanceReducer from './slices/maintenanceSlice';

export const store = configureStore({
  reducer: {
    power: powerReducer,
    alarm: alarmReducer,
    site: siteReducer,
    maintenance: maintenanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
