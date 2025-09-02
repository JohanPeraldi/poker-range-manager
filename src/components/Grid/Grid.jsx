'use client';

import React, { useEffect, useState } from 'react';

import { ACTIONS } from '@/constants/actions';
import { useRange } from '@/contexts/RangeContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { generateHands } from '@/utils/handUtils';

import ColorPicker from '../ColorPicker/ColorPicker';
import EditModeToggle from '../EditModeToggle/EditModeToggle';
import GridCell from '../GridCell/GridCell';

export default function Grid() {
  const shortcuts = useKeyboardShortcuts();
  const [grid] = useState(() => generateHands());
  const [selectedAction, setSelectedAction] = useState(ACTIONS.RAISE);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    updateHandAction,
    loadRange,
    state: { selectedPosition, ranges, colors, error, isEditMode },
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

  // Handle mouse down to start selection - only in edit mode
  const handleMouseDown = hand => {
    if (!isEditMode) return; // Ignore clicks in View Mode

    setIsSelecting(true);
    const currentAction = ranges[selectedPosition]?.[hand];

    // Toggle the action
    if (currentAction === selectedAction) {
      updateHandAction(hand, null);
    } else {
      updateHandAction(hand, selectedAction);
    }
  };

  // Handle mouse enter while selecting - only in edit mode
  const handleMouseEnter = hand => {
    if (!isSelecting || !isEditMode) return; // Ignore drag in View Mode
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
    <div className="w-full h-full flex flex-col">
      {shortcuts}

      {/* Action bar with ColorPicker and Edit Mode Toggle */}
      <div className="w-full mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Color Picker - only show in edit mode, or transform to legend in view mode */}
            <ColorPicker
              selectedAction={selectedAction}
              onActionSelect={setSelectedAction}
              isEditMode={isEditMode}
            />
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            {/* Edit Mode Toggle - positioned top-right */}
            <EditModeToggle />
          </div>
        </div>
      </div>

      {/* Grid content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 relative">
          <div
            className="border border-gray-300 select-none h-full aspect-square"
            onMouseLeave={handleMouseLeave}
          >
            <div className="grid grid-cols-13 h-full">
              {grid.flat().map((hand, index) => (
                <GridCell
                  key={index}
                  hand={hand}
                  action={ranges[selectedPosition]?.[hand]}
                  customColor={colors?.[ranges[selectedPosition]?.[hand]]}
                  onMouseDown={() => handleMouseDown(hand)}
                  onMouseEnter={() => handleMouseEnter(hand)}
                  onMouseUp={handleMouseUp}
                  isEditable={isEditMode} // Pass edit mode to GridCell
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
