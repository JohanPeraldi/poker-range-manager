import React, { useState } from 'react';
import { Copy, Clipboard } from 'lucide-react';
import { useRange } from '@/contexts/RangeContext';

const CopyPasteControls = () => {
  const { state, copyRange, pasteRange, canPaste, isLoading } = useRange();
  const { selectedPosition } = state;
  const [message, setMessage] = useState(null);

  // Clear message after 3 seconds
  const showMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCopy = async () => {
    const success = await copyRange(selectedPosition);
    showMessage(
      success ? 'success' : 'error',
      success ? 'Range copied!' : 'Failed to copy range'
    );
  };

  const handlePaste = async () => {
    const success = await pasteRange(selectedPosition);
    showMessage(
      success ? 'success' : 'error',
      success ? 'Range pasted!' : 'Failed to paste range'
    );
  };

  return (
    <div className="relative">
      {/* Message toast */}
      {message && (
        <div
          className={`absolute bottom-full mb-2 right-0 w-48 px-4 py-2 rounded-lg text-sm
            ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
        >
          {message.content}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          disabled={isLoading}
          className="flex items-center justify-center h-10 gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Copy range"
        >
          <Copy size={16} />
          <span className="hidden sm:inline">Copy</span>
        </button>

        <button
          onClick={handlePaste}
          disabled={!canPaste || isLoading}
          className="flex items-center justify-center h-10 gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Paste range"
        >
          <Clipboard size={16} />
          <span className="hidden sm:inline">Paste</span>
        </button>
      </div>
    </div>
  );
};

export default CopyPasteControls;
