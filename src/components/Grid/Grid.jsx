'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { generateHands } from '@/utils/handUtils';
import { ACTIONS } from '@/constants/actions';
import { saveRange, getRange } from '@/utils/storage';
import GridCell from './GridCell';
import ActionSelector from './ActionSelector';
import ResetControls from '../ResetControls/ResetControls';

export default function Grid({ position = 'BTN', testMode = false }) {
  const [grid] = useState(() => generateHands());
  const [cellActions, setCellActions] = useState({});
  const [previousActions, setPreviousActions] = useState(null);
  const [selectedAction, setSelectedAction] = useState(ACTIONS.RAISE);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load saved range when component mounts or position changes
  useEffect(() => {
    const loadSavedRange = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (testMode) {
          throw new Error('Test mode: Simulated localStorage error');
        }

        const savedRange = await getRange(position);
        if (savedRange) {
          setCellActions(savedRange);
        } else {
          setCellActions({}); // Reset to empty if no saved range exists
        }
      } catch (error) {
        console.error('Error loading range:', error);
        setError('Failed to load saved range');
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedRange();
  }, [position, testMode]);

  // Save to local storage
  const handleSave = useCallback(
    async newActions => {
      try {
        setError(null);

        if (testMode) {
          throw new Error('Test mode: Simulated localStorage error');
        }

        await saveRange(position, newActions);
      } catch (error) {
        console.error('Error saving range:', error);
        setError('Failed to save range');
      }
    },
    [position, testMode]
  );

  // Handle mouse down to start selection
  const handleMouseDown = hand => {
    setIsSelecting(true);
    const newActions = { ...cellActions };

    // Toggle the action
    if (newActions[hand] === selectedAction) {
      delete newActions[hand];
    } else {
      newActions[hand] = selectedAction;
    }

    setCellActions(newActions);
    handleSave(newActions);
  };

  // Handle mouse enter while selecting
  const handleMouseEnter = hand => {
    if (!isSelecting) return;

    const newActions = { ...cellActions };
    newActions[hand] = selectedAction;

    setCellActions(newActions);
    handleSave(newActions);
  };

  // Handle mouse up to end selection
  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  // Handle mouse leave from grid
  const handleMouseLeave = () => {
    setIsSelecting(false);
  };

  // Handle clearing of the grid
  const handleClear = useCallback(() => {
    setPreviousActions(cellActions); // Store current state before clearing
    setCellActions({});
    handleSave({}); // Save empty state to storage
  }, [cellActions, handleSave]);

  // Handle undoing the clear action
  const handleUndo = useCallback(() => {
    if (previousActions) {
      setCellActions(previousActions);
      handleSave(previousActions);
      setPreviousActions(null);
    }
  }, [previousActions, handleSave]);

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
        {/* Still render the grid even if there's an error */}
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <ActionSelector
          selectedAction={selectedAction}
          onActionSelect={setSelectedAction}
        />
        <ResetControls
          onClear={handleClear}
          onUndo={handleUndo}
          canUndo={!!previousActions}
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div
          className="border border-gray-300 select-none"
          onMouseLeave={handleMouseLeave}
        >
          <div className="grid grid-cols-13">
            {grid.flat().map((hand, index) => (
              <GridCell
                key={index}
                hand={hand}
                action={cellActions[hand]}
                onMouseDown={() => handleMouseDown(hand)}
                onMouseEnter={() => handleMouseEnter(hand)}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
