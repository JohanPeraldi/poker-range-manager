'use client';

import React, { useState, useEffect } from 'react';
import { generateHands } from '@/utils/handUtils';
import { ACTIONS } from '@/constants/actions';
import GridCell from './GridCell';
import ActionSelector from './ActionSelector';
import ResetControls from '../ResetControls/ResetControls';
import RangeIOControls from '../RangeIOControls/RangeIOControls';
import { useRange } from '@/contexts/RangeContext';

export default function Grid() {
  const [grid] = useState(() => generateHands());
  const [selectedAction, setSelectedAction] = useState(ACTIONS.RAISE);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    state,
    updateHandAction,
    resetRange,
    loadRange,
    state: { selectedPosition, ranges, error },
  } = useRange();

  // Load saved range when component mounts or position changes
  useEffect(() => {
    const loadSavedRange = async () => {
      try {
        setIsLoading(true);
        await loadRange(selectedPosition);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedRange();
  }, [selectedPosition, loadRange]);

  // Handle mouse down to start selection
  const handleMouseDown = hand => {
    setIsSelecting(true);
    const currentAction = ranges[selectedPosition]?.[hand];

    // Toggle the action
    if (currentAction === selectedAction) {
      updateHandAction(hand, null);
    } else {
      updateHandAction(hand, selectedAction);
    }
  };

  // Handle mouse enter while selecting
  const handleMouseEnter = hand => {
    if (!isSelecting) return;
    updateHandAction(hand, selectedAction);
  };

  // Handle mouse up to end selection
  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  // Handle mouse leave from grid
  const handleMouseLeave = () => {
    setIsSelecting(false);
  };

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Toolbar with responsive layout */}
      <div className="flex flex-wrap items-start gap-4 mb-4">
        {/* Action Selector */}
        <ActionSelector
          selectedAction={selectedAction}
          onActionSelect={setSelectedAction}
        />

        {/* Auto-spacing */}
        <div className="flex-grow"></div>

        {/* Reset and Import/Export Controls */}
        <div className="flex items-start gap-4">
          <ResetControls onClear={resetRange} />
          <RangeIOControls />
        </div>
      </div>

      {/* Grid content */}
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
                action={ranges[selectedPosition]?.[hand]}
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
