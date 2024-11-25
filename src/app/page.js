'use client';

import { useState } from 'react';

import ControlPanel from '@/components/ControlPanel/ControlPanel';
import Grid from '@/components/Grid/Grid';
import PositionSelector from '@/components/PositionSelector/PositionSelector';
import { saveRange } from '@/utils/storage';

export default function Home() {
  const [selectedPosition, setSelectedPosition] = useState('BTN');
  const [error, setError] = useState(null);
  const [forceReload, setForceReload] = useState(0);

  const handleImport = async importedData => {
    try {
      // Save each position's range to localStorage
      for (const [position, range] of Object.entries(importedData)) {
        await saveRange(position, range);
      }

      // Force Grid component to reload data
      setForceReload(prev => prev + 1);
    } catch (error) {
      setError('Failed to import ranges:' + error.message);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Poker Range Manager
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr_250px] gap-8">
        {/* Left side: Position Selector */}
        <div>
          <PositionSelector
            selectedPosition={selectedPosition}
            onPositionSelect={setSelectedPosition}
          />
        </div>

        {/* Center: Grid */}
        <div className="max-w-[700px] w-full mx-auto">
          <Grid
            key={`${selectedPosition}-${forceReload}`}
            position={selectedPosition}
            onImport={handleImport}
          />
        </div>

        {/* Right/Bottom: Control Panel */}
        <div className="lg:w-[250px]">
          <ControlPanel />
        </div>
      </div>
    </main>
  );
}
