'use client';

import { createContext, useContext, useReducer, useCallback } from 'react';
import { saveRange as saveRangeToStorage, getRange } from '@/utils/storage';
import { ACTION_COLORS } from '@/constants/colors';

// Action Types
const ACTION_TYPES = {
  SET_POSITION: 'SET_POSITION',
  UPDATE_HAND: 'UPDATE_HAND',
  UPDATE_RANGE: 'UPDATE_RANGE',
  UPDATE_COLORS: 'UPDATE_COLORS',
  RESET_RANGE: 'RESET_RANGE',
  UNDO_RESET: 'UNDO_RESET',
  LOAD_RANGE: 'LOAD_RANGE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  selectedPosition: 'BTN',
  ranges: {
    BTN: {},
    CO: {},
    HJ: {},
    LJ: {},
    SB: {},
    BB: {},
  },
  colors: {
    RAISE: ACTION_COLORS.RAISE,
    CALL: ACTION_COLORS.CALL,
    FOLD: ACTION_COLORS.FOLD,
  },
  error: null,
  previousState: null, // For undo functionality
};

// Reducer
const rangeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_POSITION:
      return {
        ...state,
        selectedPosition: action.payload,
        error: null,
      };

    case ACTION_TYPES.UPDATE_HAND:
      return {
        ...state,
        ranges: {
          ...state.ranges,
          [state.selectedPosition]: {
            ...state.ranges[state.selectedPosition],
            [action.payload.hand]: action.payload.action,
          },
        },
        error: null,
      };

    case ACTION_TYPES.UPDATE_RANGE:
      return {
        ...state,
        ranges: {
          ...state.ranges,
          [action.payload.position]: action.payload.range,
        },
        error: null,
      };

    case ACTION_TYPES.UPDATE_COLORS:
      return {
        ...state,
        colors: {
          ...state.colors,
          ...action.payload,
        },
        error: null,
      };

    case ACTION_TYPES.RESET_RANGE:
      return {
        ...state,
        previousState: {
          ranges: {
            ...state.ranges,
          },
        },
        ranges: {
          ...state.ranges,
          [state.selectedPosition]: {},
        },
        error: null,
      };

    case ACTION_TYPES.UNDO_RESET:
      if (!state.previousState) return state;
      return {
        ...state,
        ranges: {
          ...state.ranges,
          [state.selectedPosition]: {
            ...state.previousState.ranges[state.selectedPosition],
          },
        },
        previousState: null,
        error: null,
      };

    case ACTION_TYPES.LOAD_RANGE:
      return {
        ...state,
        ranges: {
          ...state.ranges,
          ...action.payload,
        },
        error: null,
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Context
const RangeContext = createContext(null);

// Custom hook for using the context
export const useRange = () => {
  const context = useContext(RangeContext);
  if (!context) {
    throw new Error('useRange must be used within a RangeProvider');
  }
  return context;
};

// Provider component
export const RangeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rangeReducer, initialState);

  // Action creators using useCallback
  const setSelectedPosition = useCallback(position => {
    dispatch({ type: ACTION_TYPES.SET_POSITION, payload: position });
  }, []);

  const updateHandAction = useCallback(
    async (hand, action) => {
      try {
        dispatch({
          type: ACTION_TYPES.UPDATE_HAND,
          payload: { hand, action },
        });

        // Persist to storage
        await saveRangeToStorage(state.selectedPosition, {
          ...state.ranges[state.selectedPosition],
          [hand]: action,
        });
      } catch (error) {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: `Failed to save hand action: ${error.message}`,
        });
      }
    },
    [state.selectedPosition, state.ranges]
  );

  const updateRangeForPosition = useCallback(async (position, range) => {
    try {
      dispatch({
        type: ACTION_TYPES.UPDATE_RANGE,
        payload: { position, range },
      });

      // Persist to storage
      await saveRangeToStorage(position, range);
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: `Failed to update range: ${error.message}`,
      });
    }
  }, []);

  const updateColors = useCallback(newColors => {
    dispatch({ type: ACTION_TYPES.UPDATE_COLORS, payload: newColors });
  }, []);

  const resetRange = useCallback(async () => {
    try {
      dispatch({ type: ACTION_TYPES.RESET_RANGE });
      await saveRangeToStorage(state.selectedPosition, {});
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: `Failed to reset range: ${error.message}`,
      });
    }
  }, [state.selectedPosition]);

  const undoReset = useCallback(async () => {
    try {
      if (!state.previousState) return;

      dispatch({ type: ACTION_TYPES.UNDO_RESET });

      // Persist the restored state
      await saveRangeToStorage(
        state.selectedPosition,
        state.previousState.ranges[state.selectedPosition]
      );
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: `Failed to undo reset: ${error.message}`,
      });
    }
  }, [state.selectedPosition, state.previousState]);

  const loadRange = useCallback(async position => {
    try {
      const savedRange = await getRange(position);
      if (savedRange) {
        dispatch({
          type: ACTION_TYPES.LOAD_RANGE,
          payload: { [position]: savedRange },
        });
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: `Failed to load range: ${error.message}`,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  }, []);

  const value = {
    state,
    setSelectedPosition,
    updateHandAction,
    updateRangeForPosition,
    updateColors,
    resetRange,
    undoReset,
    loadRange,
    clearError,
  };

  return (
    <RangeContext.Provider value={value}>{children}</RangeContext.Provider>
  );
};
