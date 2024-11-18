'use client';

import React from 'react';
import { Redo2, RotateCcw, Undo2 } from 'lucide-react';
import { useRange } from '@/contexts/RangeContext';

export default function ResetControls() {
  const { canRedo, canUndo, redo, resetRange, undo } = useRange();

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={resetRange}
        className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
        aria-label="Clear grid"
      >
        <RotateCcw size={16} />
        <span>Clear</span>
      </button>

      <button
        onClick={undo}
        disabled={!canUndo()}
        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors
          ${
            canUndo()
              ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
          }`}
        aria-label="Undo last action"
      >
        <Undo2 size={16} />
        <span>Undo</span>
      </button>

      <button
        onClick={redo}
        disabled={!canRedo()}
        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors
          ${
            canRedo()
              ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
          }`}
        aria-label="Redo last undone action"
      >
        <Redo2 size={16} />
        <span>Redo</span>
      </button>
    </div>
  );
}
