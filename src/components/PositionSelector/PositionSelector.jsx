'use client';

import React from 'react';
import { useRange } from '@/contexts/RangeContext';

const POSITIONS = {
  BTN: 'Button',
  CO: 'Cut-off',
  HJ: 'Hijack',
  LJ: 'Lojack',
  SB: 'Small Blind',
  BB: 'Big Blind',
};

export default function PositionSelector() {
  const { state, setSelectedPosition } = useRange();
  const { selectedPosition } = state;

  return (
    <div className="w-full lg:w-48">
      <h2 className="text-lg font-semibold mb-3">Position</h2>

      {/* Select element for small screens */}
      <select
        id="position-select"
        name="position"
        value={selectedPosition}
        onChange={e => setSelectedPosition(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 bg-white 
                 text-gray-700 font-medium lg:hidden focus:outline-none 
                 focus:ring-2 focus:ring-blue-500"
        aria-label="Select position"
      >
        {Object.entries(POSITIONS).map(([key, label]) => (
          <option key={key} value={key}>
            {key} - {label}
          </option>
        ))}
      </select>

      {/* Button list for desktop */}
      <div className="hidden lg:flex lg:flex-col gap-2">
        {Object.entries(POSITIONS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedPosition(key)}
            className={`
              px-4 py-3 rounded-lg font-medium transition-colors text-left
              ${
                selectedPosition === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            aria-pressed={selectedPosition === key}
          >
            <span className="font-bold">{key}</span>
            <span className="ml-2">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
