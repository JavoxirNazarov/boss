import { createSlice } from "@reduxjs/toolkit";
import { IStructures } from "../../types/fetch";

type DefaultStateType = {
  structures: IStructures[]
  selectedStructure: IStructures | null;
}


const defaultState: DefaultStateType = {
  structures: [],
  selectedStructure: null,
}

const dateSlice = createSlice({
  name: 'date',
  initialState: defaultState,
  reducers: {
    setStructures: (state, action) => {
      state.structures = action.payload;
    },
    selectStructure: (state, action) => {
      state.selectedStructure = action.payload;
    },
  },
});

// eslint-disable-next-line prettier/prettier
export const { setStructures, selectStructure } = dateSlice.actions;
export default dateSlice.reducer;
