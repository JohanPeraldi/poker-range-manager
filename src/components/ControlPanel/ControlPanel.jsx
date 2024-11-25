import React from 'react';

import CopyPasteControls from '../CopyPasteControls/CopyPasteControls';
import RangeControls from '../RangeControls/RangeControls';
import ResetControls from '../ResetControls/ResetControls';

export default function ControlPanel() {
  return (
    <div className="w-full lg:w-64">
      {/* Message area with fixed height to prevent layout shifts */}
      <div className="h-24 mb-4">
        <div id="message-container" className="relative" />
      </div>

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
    </div>
  );
}
