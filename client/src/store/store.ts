import { combineReducers } from '@reduxjs/toolkit';
import authReducers from "@/store/slices/authSlice";
import departmentReducers from "@/store/slices/departmentSlice";
import eventReducers from "@/store/slices/eventsSlice";
import dashboardReducers from "@/store/slices/dashboardSlice";
import studentReducers from "@/store/slices/studentSlice";

export const rootReducer = combineReducers({
  auth: authReducers,
  departments: departmentReducers,
  events: eventReducers,
  dashboard: dashboardReducers,
  student: studentReducers,
});
