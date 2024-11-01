'use client';

import { ACTIONS, ACTION_COLORS } from '@/constants/actions';

export default function ActionSelector({ selectedAction, onActionSelect }) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        className={`px-4 py-2 rounded ${
          selectedAction === ACTIONS.RAISE ? 'ring-2 ring-black' : ''
        } ${ACTION_COLORS[ACTIONS.RAISE]}`}
        onClick={() => onActionSelect(ACTIONS.RAISE)}
      >
        Raise
      </button>
      <button
        className={`px-4 py-2 rounded ${
          selectedAction === ACTIONS.CALL ? 'ring-2 ring-black' : ''
        } ${ACTION_COLORS[ACTIONS.CALL]}`}
        onClick={() => onActionSelect(ACTIONS.CALL)}
      >
        Call
      </button>
      <button
        className={`px-4 py-2 rounded ${
          selectedAction === ACTIONS.FOLD ? 'ring-2 ring-black' : ''
        } ${ACTION_COLORS[ACTIONS.FOLD]}`}
        onClick={() => onActionSelect(ACTIONS.FOLD)}
      >
        Fold
      </button>
    </div>
  );
}
