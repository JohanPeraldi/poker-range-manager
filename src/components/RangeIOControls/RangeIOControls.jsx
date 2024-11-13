'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Download, Upload, Loader2, X } from 'lucide-react';
import { exportRanges, importRanges } from '@/utils/rangeUtils';
import { useRange } from '@/contexts/RangeContext';

export default function RangeIOControls() {
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState(null);
  const { state, updateRangeForPosition } = useRange();

  // Auto-dismiss success messages after 3 seconds
  useEffect(() => {
    if (message?.type === 'success') {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const getReadableErrorMessage = error => {
    // JSON parsing errors
    if (error.message.includes('JSON')) {
      return 'The file appears to be corrupted or not properly formatted. Please ensure it is a valid JSON file.';
    }

    // Invalid data structure
    if (error.message.includes('Invalid position')) {
      return 'This file does not contain valid poker ranges. Expected positions are: BTN, CO, HJ, LJ, SB, and BB.';
    }

    // Invalid actions
    if (error.message.includes('Invalid action')) {
      return 'This file contains an invalid action. Only RAISE, CALL, and FOLD are allowed.';
    }

    // Invalid hands
    if (error.message.includes('Invalid hand')) {
      return 'This file contains invalid hand combinations. Please check the format of your hands (e.g., "AKs", "KQo").';
    }

    // Fallback error message
    return 'Could not import the file. Please ensure it contains valid poker ranges.';
  };

  const handleExport = async () => {
    try {
      await exportRanges(state.ranges);
      setMessage({ type: 'success', content: 'Ranges exported successfully!' });
    } catch (error) {
      console.error('Export failed:', error);
      setMessage({
        type: 'error',
        content: 'Could not export ranges. Please try again.',
      });
    }
  };

  const handleImport = async event => {
    try {
      setIsImporting(true);
      setMessage(null);
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.name.toLowerCase().endsWith('.json')) {
        throw new Error('Please select a valid JSON file');
      }

      const importedData = await importRanges(file);

      // Validate data structure before importing
      if (!importedData || typeof importedData !== 'object') {
        throw new Error('Invalid range data format');
      }

      // Check if the imported data has the expected structure
      const validPositions = ['BTN', 'CO', 'HJ', 'LJ', 'SB', 'BB'];
      const validActions = ['RAISE', 'CALL', 'FOLD'];

      // First validate all data before importing anything
      for (const [position, range] of Object.entries(importedData)) {
        // Check if position is valid
        if (!validPositions.includes(position)) {
          throw new Error(`Invalid position: ${position}`);
        }

        // Check if ranges is an object
        if (typeof range !== 'object' || range === null) {
          throw new Error(`Invalid range data for position: ${position}`);
        }

        // Check if actions are valid
        for (const [hand, action] of Object.entries(range)) {
          if (!validActions.includes(action)) {
            throw new Error(
              `Invalid action "${action}" for hand ${hand} in position ${position}`
            );
          }

          // Optional: Add hand validation if needed
          const validHandFormat = /^[AKQJT98765432]{2}[so]?$/;
          if (!validHandFormat.test(hand)) {
            throw new Error(
              `Invalid hand format: ${hand} in position ${position}`
            );
          }
        }
      }

      // If validation passes, import the ranges
      for (const [position, range] of Object.entries(importedData)) {
        await updateRangeForPosition(position, range);
      }

      // Reset file input
      event.target.value = '';

      // Show success message
      setMessage({ type: 'success', content: 'Ranges imported successfully!' });
    } catch (error) {
      console.error('Import failed:', error);
      setMessage({ type: 'error', content: getReadableErrorMessage(error) });
    } finally {
      setIsImporting(false);
    }
  };

  const clearMessage = () => {
    setMessage(null);
  };

  return (
    <div className="relative">
      {/* Message display */}
      {message && (
        <div
          className={`absolute bottom-full mb-2 right-0 w-72 px-4 py-2 rounded-lg text-sm
            transition-opacity duration-300
            ${
              message.type === 'success'
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
        >
          <div className="flex items-start justify-between gap-2">
            <p>{message.content}</p>
            <button
              onClick={clearMessage}
              className={`${
                message.type === 'success'
                  ? 'text-green-700 hover:text-green-800'
                  : 'text-red-700 hover:text-red-800'
              }`}
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleExport}
          className="flex items-center justify-center h-10 gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          aria-label="Export ranges"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="flex items-center justify-center h-10 gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Import ranges"
        >
          {isImporting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          <span className="hidden sm:inline">
            {isImporting ? 'Importing...' : 'Import'}
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          aria-label="Import ranges from file"
        />
      </div>
    </div>
  );
}
