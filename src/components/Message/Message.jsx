import React from 'react';

import { X } from 'lucide-react';

export default function Message({ type, content, onDismiss }) {
  return (
    <div
      className={`absolute w-full px-4 py-2 rounded-lg text-sm
        ${
          type === 'success'
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p>{content}</p>
        <button
          onClick={onDismiss}
          className={`${
            type === 'success'
              ? 'text-green-700 hover:text-green-800'
              : 'text-red-700 hover:text-red-800'
          }`}
          aria-label="Dismiss message"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
