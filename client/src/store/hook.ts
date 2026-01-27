import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Type-safe Redux hooks
 * Use these instead of plain `useDispatch` and `useSelector`
 */

// Use throughout your app instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
