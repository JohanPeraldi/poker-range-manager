'use client';

import React, { useState } from 'react';
import { generateHands } from '@/utils/handUtils';
import { ACTIONS } from '@/constants/actions';
import GridCell from './GridCell';
import ActionSelector from './ActionSelector';

export default function Grid() {
  const [grid] = useState(() => generateHands());
  const [cellActions, setCellActions] = useState({});
  const [selectedAction, setSelectedAction] = useState(ACTIONS.RAISE);

  const handleCellClick = hand => {
    console.log('Before click:', {
      hand,
      currentAction: cellActions[hand],
      selectedAction,
    });

    setCellActions(prev => {
      const newActions = { ...prev };
      if (newActions[hand] === selectedAction) {
        delete newActions[hand];
      } else {
        newActions[hand] = selectedAction;
      }

      console.log('After click:', { hand, newAction: newActions[hand] });
      return newActions;
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <ActionSelector
        selectedAction={selectedAction}
        onActionSelect={setSelectedAction}
      />
      <div className="border border-gray-300">
        <div className="grid grid-cols-13">
          {grid.flat().map((hand, index) => (
            <GridCell
              key={index}
              hand={hand}
              action={cellActions[hand]}
              onClick={handleCellClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
