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

          return (
            <button
              key={action}
              className={`px-4 py-2 rounded ${bgColor} ${textColor} hover:brightness-95`}
              onClick={() => onActionSelect(action)}
            >
              {action.charAt(0) + action.slice(1).toLowerCase()}
            </button>
          );
        })}
    </div>
  );
}
