import { combineReducers } from '@reduxjs/toolkit';
import authReducers from "@/store/slices/authSlice";
// import departmentReducers from "@/store/slices/departmentSlice";
// import eventReducers from "@/store/slices/eventsSlice";

export const rootReducer = combineReducers({
  auth: authReducers,
  // departments: departmentReducers,
  // events: eventReducers,
});