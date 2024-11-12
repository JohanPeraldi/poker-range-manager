import React, { useRef, useState } from 'react';
import { Download, Upload, Loader2 } from 'lucide-react';
import { exportRanges, importRanges } from '@/utils/rangeUtils';

export default function RangeIOControls({ onImport }) {
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    try {
      // Get all ranges from localStorage
      const rangesJSON = localStorage.getItem('poker-ranges');
      const ranges = rangesJSON ? JSON.parse(rangesJSON) : {};

      // Export ranges to file
      await exportRanges(ranges);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export ranges: ' + error.message);
    }
  };

  const handleImport = async event => {
    try {
      setIsImporting(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const importedData = await importRanges(file);

      // Import all ranges
      await onImport(importedData);

      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
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
  );
}
