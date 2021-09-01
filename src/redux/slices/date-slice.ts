import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { startDate } from '../../utils/date';

const defaultState = {
  prevDate: startDate(),
  selectedDate: startDate(),
};

const dateSlice = createSlice({
  name: 'date',
  initialState: defaultState,
  reducers: {
    selectDate: (
      state,
      action: PayloadAction<{ type: keyof typeof defaultState; day: string }>,
    ) => {
      const { day, type } = action.payload;
      state[type] = day;
    },
    selectDateAll: (state, action) => {
      state.prevDate = action.payload;
      state.selectedDate = action.payload;
    },
  },
});

export default dateSlice.reducer;
export const { selectDate, selectDateAll } = dateSlice.actions;
