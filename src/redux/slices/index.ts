import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import dateSlice from './date-slice';
import structuresSlice from './structures-slice';
import userSlice from './user-slice';
import pressedSlice from './pressed-slice';

export const store = configureStore({
  reducer: {
    dateState: dateSlice,
    structuresState: structuresSlice,
    userState: userSlice,
    pressedState: pressedSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
