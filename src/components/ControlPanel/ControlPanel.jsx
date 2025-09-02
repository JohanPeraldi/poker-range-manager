import React from 'react';

import { useRange } from '@/contexts/RangeContext';

import CopyPasteControls from '../CopyPasteControls/CopyPasteControls';
import RangeControls from '../RangeControls/RangeControls';
import ResetControls from '../ResetControls/ResetControls';

export default function ControlPanel() {
  const {
    state: { isEditMode },
  } = useRange();

  return (
    <div className="w-full lg:w-64">
      {/* Message area with fixed height to prevent layout shifts */}
      <div className="h-24 mb-4">
        <div id="message-container" className="relative" />
      </div>

      {/* VIEW MODE: Show minimal message */}
      {!isEditMode && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm mb-2">
            👁️ <strong>View Mode</strong>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Ranges are currently locked.
            <br />
            Click <strong>Edit Ranges</strong> to access all tools.
          </p>
        </div>
      )}

      {/* EDIT MODE: Show full control panel */}
      {isEditMode && (
        <>
          {/* Actions */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Actions</h2>
            <ResetControls />
          </div>

          {/* Range Management */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Range Management</h2>
            <div className="flex flex-col gap-2">
              <CopyPasteControls />
              <RangeControls />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
