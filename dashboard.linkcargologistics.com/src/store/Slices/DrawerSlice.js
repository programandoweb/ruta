import { createSlice } from "@reduxjs/toolkit";

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState: {
    openDrawer: false,
    title: null,
    data: {},
    size: "md:size-auto",
  },
  reducers: {
    setOpenDrawer: (state, action) => {
      state.openDrawer = action.payload;
    },
    setDrawerTitle: (state, action) => {
      state.title = action.payload;
    },
    setDrawerData: (state, action) => {
      state.data = action.payload;
    },
    clearDrawer: (state) => {
      state.openDrawer = false;
      state.title = null;
      state.data = {};
    },
  },
});

export const {
  setOpenDrawer,
  setDrawerTitle,
  setDrawerData,
  clearDrawer,
} = drawerSlice.actions;

export default drawerSlice.reducer;
