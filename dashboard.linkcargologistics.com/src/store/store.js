import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "./Slices/errorSlice";
import errorInputsSliceReducer from "./Slices/errorInputsSlice";
import userReducer from "./Slices/userSlice";
import dataSlice from "./Slices/dataSlice";
import dialogMessagesSlice from "./Slices/dialogMessagesSlice";
import shoppingCartSlice from "./Slices/shoppingCartSlice";
import snackbarSlice from "./Slices/snackbarSlice";
import loadingSlice from "./Slices/loadingSlice";
import languageSlice from "./Slices/languageSlice";
import storeSlice from "./Slices/storeSlice";
import tableSlice from "./Slices/tableSlice";
import formInputs from "./Slices/formInputsSlice";
import drawer from "./Slices/DrawerSlice";

export default configureStore({
  reducer: {
    data: dataSlice,
    snackbar: snackbarSlice,
    shoppingCart: shoppingCartSlice,
    error: errorReducer,
    errorInputs: errorInputsSliceReducer,
    user: userReducer,
    dialog: dialogMessagesSlice,
    loading: loadingSlice,
    lang: languageSlice,
    store: storeSlice,
    table: tableSlice,
    inputs:formInputs,
    drawer
  },
});