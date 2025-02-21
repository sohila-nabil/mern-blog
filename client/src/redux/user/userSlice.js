import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {},
  loading: false,
  error: null,
};


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinStart:(state)=>{
        state.loading = true;
        state.error = null;
    },
    signinSuccess:(state, action)=>{
        state.loading = false;
        state.currentUser = action.payload;
    },
    signinFail:(state, action)=>{
        state.loading = false;
        state.error = action.payload;
        state.currentUser = {};
    },
  },
});

export const { signinStart, signinSuccess, signinFail } = userSlice.actions;
export default userSlice.reducer;