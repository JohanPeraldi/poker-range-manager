'use client';

import { ACTIONS, COLORS } from '@/constants/actions';
import { getContrastText } from '@/utils/colorUtils';

export default function ActionSelector({ selectedAction, onActionSelect }) {
  return (
    <div className="flex gap-2 mb-4">
      {Object.values(ACTIONS)
        .filter(action => action !== null)
        .map(action => {
          const bgColor = COLORS[action];
          const textColor = getContrastText(bgColor);
          const isSelected = action === selectedAction;

          return (
            <button
              key={action}
              className={`flex items-center justify-center h-10 gap-2 px-4 py-2 action-button ${bgColor} ${textColor} ${isSelected ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
              onClick={() => onActionSelect(action)}
              aria-pressed={isSelected}
            >
              {action.charAt(0) + action.slice(1).toLowerCase()}
            </button>
          );
        })}
    </div>
  );
}
