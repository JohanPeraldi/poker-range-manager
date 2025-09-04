'use client';

import { Edit3, Lock } from 'lucide-react';

import { useRange } from '@/contexts/RangeContext';

export default function EditModeToggle() {
  const {
    state: { isEditMode },
    toggleEditMode,
  } = useRange();

  return (
    <button
      onClick={toggleEditMode}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg mode-toggle-button font-medium ${
        isEditMode
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 ring-2 ring-blue-300'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={isEditMode ? 'Lock ranges (View Mode)' : 'Edit ranges (Edit Mode)'}
      aria-label={isEditMode ? 'Switch to View Mode' : 'Switch to Edit Mode'}
      aria-pressed={isEditMode}
    >
      <div className="transition-transform duration-200 ease-in-out">
        {isEditMode ? <Lock size={14} /> : <Edit3 size={14} />}
      </div>
      <span className="text-xs sm:text-sm transition-colors duration-200">
        {isEditMode ? 'Lock Ranges' : 'Edit Ranges'}
      </span>
    </button>
  );
}
