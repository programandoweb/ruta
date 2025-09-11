import { createSlice } from "@reduxjs/toolkit";

export const socketSlice = createSlice({
  name: 'socketState',
  initialState: {
    eventDinamic: null,    
    sock: null,    
    status:null,
    mesa_id:null,
    cuenta_id:null,
    user:null,
    dispatchEmit:null
  },
  reducers: {
    setDispatchEmit: (state, action) => {
      return { ...state, dispatchEmit: action.payload };
    },
    clearDispatchEmit: (state) => {
      return { ...state, dispatchEmit: null };
    },
    setEventDinamic: (state, action) => {
      return { ...state, eventDinamic: action.payload };
    },    
    setSock: (state, action) => {
      return { ...state, sock: action.payload };
    },    
    setStatus: (state, action) => {
      return { ...state, status: action.payload };
    }, 
    setMesaId: (state, action) => {
      return { ...state, mesa_id: action.payload };
    },    
    setCuentaId: (state, action) => {
      return { ...state, cuenta_id: action.payload };
    },    
    setUser: (state, action) => {
      return { ...state, user: action.payload };
    },    
  },
});

export const { setEventDinamic, setSock, setStatus, setMesaId, setDispatchEmit, setCuentaId, setUser , clearDispatchEmit}   =   socketSlice.actions;

export default socketSlice.reducer;
