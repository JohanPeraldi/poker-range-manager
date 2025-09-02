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
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
        isEditMode
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 ring-2 ring-blue-300'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={isEditMode ? 'Lock ranges (View Mode)' : 'Edit ranges (Edit Mode)'}
      aria-label={isEditMode ? 'Switch to View Mode' : 'Switch to Edit Mode'}
      aria-pressed={isEditMode}
    >
      {isEditMode ? (
        <>
          <Lock size={16} />
          <span className="text-sm">Lock Ranges</span>
        </>
      ) : (
        <>
          <Edit3 size={16} />
          <span className="text-sm">Edit Ranges</span>
        </>
      )}
    </button>
  );
}
