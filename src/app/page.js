'use client';

import { useState } from 'react';
import Grid from '@/components/Grid/Grid';
import PositionSelector from '@/components/PositionSelector/PositionSelector';

export default function Home() {
  const [selectedPosition, setSelectedPosition] = useState('BTN');

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Poker Range Manager
      </h1>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <PositionSelector
          selectedPosition={selectedPosition}
          onPositionSelect={setSelectedPosition}
        />
        <div className="flex-1 min-w-0">
          {/* Toggle testMode to true to simulate localStorage errors (remove before sending to production) */}
          <Grid position={selectedPosition} testMode={false} />
        </div>
      </div>
    </main>
  );
}
