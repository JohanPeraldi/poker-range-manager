import React from 'react';

import CopyPasteControls from '../CopyPasteControls/CopyPasteControls';
import RangeIOControls from '../RangeIOControls/RangeIOControls';
import ResetControls from '../ResetControls/ResetControls';

export default function ControlPanel() {
  return (
    <div className="w-full lg:w-64">
      {/* Primary Controls Group */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Actions</h2>
        <ResetControls />
      </div>

      {/* Secondary Controls Group */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Range Management</h2>
        <div className="flex flex-col gap-2">
          <CopyPasteControls />
          <RangeIOControls />
        </div>
      </div>
    </div>
  );
}