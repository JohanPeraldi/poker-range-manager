export const ACTIONS = {
  NONE: null,
  RAISE: 'RAISE',
  CALL: 'CALL',
  FOLD: 'FOLD',
};

// Colors for the action selector buttons
export const ACTION_COLORS = {
  RAISE: 'bg-red-500 text-white hover:bg-red-600',
  CALL: 'bg-blue-200 hover:bg-blue-300',
  FOLD: 'bg-gray-300 hover:bg-gray-400',
};

// Colors for the grid cells when an action is applied
export const CELL_COLORS = {
  RAISE: 'bg-red-500',
  CALL: 'bg-blue-200',
  FOLD: 'bg-gray-300',
};
