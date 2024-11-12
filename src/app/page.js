'use client';

import { useState } from 'react';
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

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <PositionSelector
          selectedPosition={selectedPosition}
          onPositionSelect={setSelectedPosition}
        />
        <div className="flex-1 min-w-0">
          {/* Toggle testMode to true to simulate localStorage errors (remove before sending to production) */}
          <Grid
            key={`${selectedPosition}-${forceReload}`}
            position={selectedPosition}
            testMode={false}
            onImport={handleImport}
          />
        </div>
      </div>
    </main>
  );
}
