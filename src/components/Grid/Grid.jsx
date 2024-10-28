'use client';

import React from 'react';
import { generateHands } from '@/utils/handUtils';
import GridCell from './GridCell';

export default function Grid() {
  const grid = generateHands();

  const handleCellClick = hand => {
    console.log('Clicked:', hand);
  };

  return (
    <div className="w-full max-w-3xl mx-auto border border-gray-300">
      <div className="grid grid-cols-13">
        {grid.flat().map((hand, index) => (
          <GridCell key={index} hand={hand} onClick={handleCellClick} />
        ))}
      </div>
    </div>
  );
}
