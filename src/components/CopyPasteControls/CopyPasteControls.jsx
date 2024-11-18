'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { Clipboard, Copy } from 'lucide-react';

import { useRange } from '@/contexts/RangeContext';

import Message from '../Message/Message';

export default function CopyPasteControls() {
  const { state, copyRange, pasteRange, canPaste, isLoading } = useRange();
  const { selectedPosition } = state;
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message?.type === 'success') {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const showMessage = (type, content) => {
    setMessage({ type, content });
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
    <>
      {/* Message section */}
      {message &&
        createPortal(
          <Message
            type={message.type}
            content={message.content}
            onDismiss={() => setMessage(null)}
          />,
          document.getElementById('message-container')
        )}

      {/* Copy/Paste Controls */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <button
          onClick={handleCopy}
          disabled={isLoading}
          className="flex items-center justify-center h-10 gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Copy range"
        >
          <Copy size={16} />
          <span>Copy</span>
        </button>

        <button
          onClick={handlePaste}
          disabled={!canPaste || isLoading}
          className="flex items-center justify-center h-10 gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Paste range"
        >
          <Clipboard size={16} />
          <span>Paste</span>
        </button>
      </div>
    </>
  );
}
