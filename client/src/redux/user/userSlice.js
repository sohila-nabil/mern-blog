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
    signinStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signinSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    signinFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentUser = {};
    },
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    updateUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.loading = false;
      state.currentUser = {};
      state.error = null;
    },
    deleteUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = {};
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  signinStart,
  signinSuccess,
  signinFail,
  updateUserStart,
  updateUserSuccess,
  updateUserFail,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFail,
  signoutSuccess,
} = userSlice.actions;
export default userSlice.reducer;
