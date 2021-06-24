import { createSlice } from "@reduxjs/toolkit";

type pressedType = {
  pressed: string[]
}

const defaultState: pressedType = {
  pressed: [],
}

const pressedSlice = createSlice({
  name: 'pressed',
  initialState: defaultState,
  reducers: {
    setPressed: (state, action) => {
      state.pressed = [...state.pressed, action.payload]
    },
    clearPressed: (state) => {
      state.pressed = []
    }
  }
})


export default pressedSlice.reducer
export const { setPressed, clearPressed } = pressedSlice.actions