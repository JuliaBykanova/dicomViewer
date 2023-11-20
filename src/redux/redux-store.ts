import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import tableReducer from './table/table-reducer';

export const store = configureStore({
  reducer: {
    table: tableReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
});

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

//@ts-ignore
window.store = store;

