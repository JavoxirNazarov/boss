import { createSlice } from "@reduxjs/toolkit";

type userType = {
  user: null | {
    role: string;
    token: string;
    structure: string;
    structureName: string;
  };
};

const defaultState: userType = {
  user: null,
};

const userSlice = createSlice({
  name: 'date',
  initialState: defaultState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  }
})


export default userSlice.reducer
export const { setUser } = userSlice.actions