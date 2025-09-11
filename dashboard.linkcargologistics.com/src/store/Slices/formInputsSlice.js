import { createSlice } from "@reduxjs/toolkit";

export const inputsSlice = createSlice({
    name: 'inputs',
    initialState: {
        data: false // Si planeas usar un objeto inicial, puedes usar {} en lugar de false
    },
    reducers: {
        setInputs: (state, action) => {
            return { ...state, data: { ...state.data, ...action.payload } };
        },
        clearInputs: (state) => {
            return { ...state, data: false }; // Restablece a su valor inicial
        },
    }
});

// Exportar las acciones
export const { setInputs, clearInputs } = inputsSlice.actions;

// Exportar el reducer
export default inputsSlice.reducer;
