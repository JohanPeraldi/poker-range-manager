import React from 'react';
import { RotateCcw, Undo2 } from 'lucide-react';

export default function ResetControls({ onClear, onUndo, canUndo }) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={onClear}
        className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
        aria-label="Clear grid"
      >
        <RotateCcw size={16} />
        <span>Clear</span>
      </button>

      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors
          ${
            canUndo
              ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
          }`}
        aria-label="Undo clear"
      >
        <Undo2 size={16} />
        <span>Undo</span>
      </button>
    </div>
  );
}
