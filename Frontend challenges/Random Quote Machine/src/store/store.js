import { combineReducers, configureStore, } from "@reduxjs/toolkit";
import { quoteReducer } from "./reducer";

const rootReducer = combineReducers({
  quote:quoteReducer
})

export const store  = configureStore({
  reducer:rootReducer
})

