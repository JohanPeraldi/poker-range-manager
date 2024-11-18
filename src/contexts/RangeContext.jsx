'use client';

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
} from 'react';

import { ACTION_COLORS } from '@/constants/colors';
import { getRange, saveRange as saveRangeToStorage } from '@/utils/storage';

// Action Types
const ACTION_TYPES = {
  SET_POSITION: 'SET_POSITION',
  UPDATE_HAND: 'UPDATE_HAND',
  UPDATE_RANGE: 'UPDATE_RANGE',
  UPDATE_COLORS: 'UPDATE_COLORS',
  RESET_RANGE: 'RESET_RANGE',
  UNDO: 'UNDO',
  REDO: 'REDO',
  LOAD_RANGE: 'LOAD_RANGE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

/**
 * @typedef {Object} RangeState
 * @property {string} selectedPosition - Currently selected position
 * @property {Object} ranges - Range data for all positions
 * @property {Object} colors - Color configurations for actions
 * @property {string|null} error - Current error message if any
 * @property {Object} history - Undo history for each position
 * @property {Object} redoHistory - Redo history for each position
 */

// Initial state matches RangeState type
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
  history: {}, // For undo functionality
  redoHistory: {}, // For redo functionality
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

    case ACTION_TYPES.UPDATE_HAND: {
      const { hand, action: handAction } = action.payload;
      const currentRange = state.ranges[state.selectedPosition] || {};
      const newRange = { ...currentRange };
      const position = state.selectedPosition;

      // Store current state in history before updating
      const positionHistory = state.history[position] || [];
      const newHistory = {
        ...state.history,
        [position]: [
          {
            ranges: { ...currentRange },
            type: 'HAND_UPDATE',
            timestamp: Date.now(),
          },
          ...positionHistory,
        ].slice(0, 50), // Limit history to 50 entries
      };

      if (handAction === null) {
        delete newRange[hand];
      } else {
        newRange[hand] = handAction;
      }

      // Clear redo history for this position when new action is performed
      return {
        ...state,
        ranges: {
          ...state.ranges,
          [position]: newRange,
        },
        history: newHistory,
        redoHistory: {
          ...state.redoHistory,
          [position]: [], // Clear redo history
        },
        error: null,
      };
    }

    case ACTION_TYPES.UPDATE_RANGE: {
      const { position, range } = action.payload;
      const currentRange = state.ranges[position] || {};
      const positionHistory = state.history[position] || [];

      const newHistory = {
        ...state.history,
        [position]: [
          {
            ranges: { ...currentRange },
            type: 'RANGE_UPDATE',
            timestamp: Date.now(),
          },
          ...positionHistory,
        ].slice(0, 50),
      };

      return {
        ...state,
        ranges: {
          ...state.ranges,
          [position]: range,
        },
        history: newHistory,
        error: null,
      };
    }

    case ACTION_TYPES.UPDATE_COLORS:
      return {
        ...state,
        colors: {
          ...state.colors,
          ...action.payload,
        },
        error: null,
      };

    case ACTION_TYPES.RESET_RANGE: {
      const currentRange = state.ranges[state.selectedPosition] || {};
      const positionHistory = state.history[state.selectedPosition] || [];

      const newHistory = {
        ...state.history,
        [state.selectedPosition]: [
          {
            ranges: { ...currentRange },
            type: 'RESET',
            timestamp: Date.now(),
          },
          ...positionHistory,
        ].slice(0, 50),
      };

      return {
        ...state,
        ranges: {
          ...state.ranges,
          [state.selectedPosition]: {},
        },
        history: newHistory,
        error: null,
      };
    }

    case ACTION_TYPES.UNDO: {
      const position = state.selectedPosition;
      const positionHistory = state.history[position] || [];
      const positionRedoHistory = state.redoHistory[position] || [];

      if (positionHistory.length === 0) {
        return state;
      }

      const [lastState, ...remainingHistory] = positionHistory;
      const currentRange = state.ranges[position];

      // Add current state to redo history
      const newRedoHistory = {
        ...state.redoHistory,
        [position]: [
          {
            ranges: { ...currentRange },
            type: 'UNDO',
            timestamp: Date.now(),
          },
          ...positionRedoHistory,
        ].slice(0, 50),
      };

      return {
        ...state,
        ranges: {
          ...state.ranges,
          [position]: lastState.ranges,
        },
        history: {
          ...state.history,
          [position]: remainingHistory,
        },
        redoHistory: newRedoHistory,
        error: null,
      };
    }

    case ACTION_TYPES.REDO: {
      const position = state.selectedPosition;
      const positionRedoHistory = state.redoHistory[position] || [];
      const positionHistory = state.history[position] || [];

      if (positionRedoHistory.length === 0) {
        return state;
      }

      const [lastRedoState, ...remainingRedoHistory] = positionRedoHistory;
      const currentRange = state.ranges[position];

      // Add current state to undo history
      const newHistory = {
        ...state.history,
        [position]: [
          {
            ranges: { ...currentRange },
            type: 'REDO',
            timestamp: Date.now(),
          },
          ...positionHistory,
        ].slice(0, 50),
      };

      return {
        ...state,
        ranges: {
          ...state.ranges,
          [position]: lastRedoState.ranges,
        },
        history: newHistory,
        redoHistory: {
          ...state.redoHistory,
          [position]: remainingRedoHistory,
        },
        error: null,
      };
    }

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

/**
 * Context for managing poker hand ranges
 * @type {React.Context<{
 *   state: RangeState,
 *   setSelectedPosition: (position: string) => void,
 *   updateHandAction: (hand: string, action: string) => Promise<void>,
 *   updateRangeForPosition: (position: string, range: Object) => Promise<void>,
 *   resetRange: () => Promise<void>,
 *   undo: () => Promise<void>,
 *   redo: () => Promise<void>,
 *   canUndo: () => boolean,
 *   canRedo: () => boolean,
 *   loadRange: (position: string) => Promise<void>,
 *   clearError: () => void,
 *   copyRange: (position: string) => Promise<boolean>,
 *   pasteRange: (position: string) => Promise<boolean>,
 *   canPaste: boolean
 * }>}
 */
const RangeContext = createContext(null);

/**
 * Custom hook for using the range context
 * @returns {Object} The range context value
 * @throws {Error} When used outside of RangeProvider
 */
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
  const [copiedRange, setCopiedRange] = useState(null);

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

  const undo = useCallback(async () => {
    try {
      dispatch({ type: ACTION_TYPES.UNDO });
      const position = state.selectedPosition;
      const history = state.history[position];

      if (history?.length > 0) {
        await saveRangeToStorage(position, history[0].ranges);
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: `Failed to undo: ${error.message}`,
      });
    }
  }, [state.selectedPosition, state.history]);

  const canUndo = useCallback(
    () => (state.history[state.selectedPosition]?.length ?? 0) > 0,
    [state.history, state.selectedPosition]
  );

  const canRedo = useCallback(
    () => (state.redoHistory[state.selectedPosition]?.length ?? 0) > 0,
    [state.redoHistory, state.selectedPosition]
  );

  const redo = useCallback(async () => {
    try {
      dispatch({ type: ACTION_TYPES.REDO });
      const position = state.selectedPosition;
      const redoHistory = state.redoHistory[position];

      if (redoHistory?.length > 0) {
        await saveRangeToStorage(position, redoHistory[0].ranges);
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: `Failed to redo: ${error.message}`,
      });
    }
  }, [state.selectedPosition, state.redoHistory]);

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

  const copyRange = useCallback(async position => {
    try {
      const range = await getRange(position);
      setCopiedRange({ position, range });
      return true;
    } catch (error) {
      console.error('Error copying range:', error);
      return false;
    }
  }, []);

  const pasteRange = useCallback(
    async targetPosition => {
      if (!copiedRange?.range) return false;

      try {
        await saveRangeToStorage(targetPosition, copiedRange.range);
        dispatch({
          type: ACTION_TYPES.UPDATE_RANGE,
          payload: { position: targetPosition, range: copiedRange.range },
        });
        return true;
      } catch (error) {
        console.error('Error pasting range:', error);
        return false;
      }
    },
    [copiedRange]
  );

  const value = {
    state,
    setSelectedPosition,
    updateHandAction,
    updateRangeForPosition,
    updateColors,
    resetRange,
    undo,
    canUndo,
    redo,
    canRedo,
    loadRange,
    clearError,
    copyRange,
    pasteRange,
    copiedRange,
    canPaste: !!copiedRange?.range,
  };

  return (
    <RangeContext.Provider value={value}>{children}</RangeContext.Provider>
  );
};
