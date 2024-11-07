'use client';

import React from 'react';

const POSITIONS = {
  BTN: 'Button',
  CO: 'Cut-off',
  HJ: 'Hijack',
  LJ: 'Lojack',
  SB: 'Small Blind',
  BB: 'Big Blind',
};

export default function PositionSelector({
  selectedPosition,
  onPositionSelect,
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Select Position</h2>
      <div className="flex flex-wrap gap-2">
        {Object.entries(POSITIONS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onPositionSelect(key)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${
                selectedPosition === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            aria-pressed={selectedPosition === key}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
