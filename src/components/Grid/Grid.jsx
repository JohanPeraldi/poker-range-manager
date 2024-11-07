'use client';

import React, { useState, useCallback } from 'react';
import { generateHands } from '@/utils/handUtils';
import { ACTIONS } from '@/constants/actions';
import { saveRange } from '@/utils/storage';
import GridCell from './GridCell';
import ActionSelector from './ActionSelector';

export default function Grid({ position = 'BTN' }) {
  const [grid] = useState(() => generateHands());
  const [cellActions, setCellActions] = useState({});
  const [selectedAction, setSelectedAction] = useState(ACTIONS.RAISE);
  const [isSelecting, setIsSelecting] = useState(false);

  // Save to local storage
  const handleSave = useCallback(
    async newActions => {
      try {
        await saveRange(position, newActions);
      } catch (error) {
        console.error('Error saving range:', error);
      }
    },
    [position]
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

  return (
    <div className="w-full max-w-3xl mx-auto">
      <ActionSelector
        selectedAction={selectedAction}
        onActionSelect={setSelectedAction}
      />

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
    </div>
  );
}
