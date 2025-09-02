import { COLORS } from '@/constants/actions';
import { GRID_COLORS, TEXT_COLORS } from '@/constants/colors';
import { getContrastText } from '@/utils/colorUtils';

export default function GridCell({
  hand,
  action,
  customColor,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  isEditable = true, // New prop to control editability
}) {
  const isPocketPair = hand.length === 2 && hand[0] === hand[1];

  const baseClass = 'grid-cell select-none transition-all duration-150';

  // Get background color
  let bgStyle = {};
  let bgClass = '';
  let textClass = '';

  if (action) {
    // Check if we have a custom color (hex value)
    if (customColor && customColor.startsWith('#')) {
      bgStyle = { backgroundColor: customColor };
      // Use the same getContrastText function for consistency
      textClass = getContrastText(customColor);
    } else {
      // Use Tailwind class
      bgClass = COLORS[action];
      textClass = getContrastText(bgClass);
    }
  } else {
    // No action - use default grid colors
    bgClass = isPocketPair ? GRID_COLORS.POCKET_PAIR : GRID_COLORS.OFFSUIT;
    textClass = TEXT_COLORS.DARK;
  }

  const textSizeClass = 'text-[8px] xxs:text-[9px] xs:text-[10px] sm:text-sm'; // Responsive text sizing

  // Conditional event handlers and styling based on editability
  const eventHandlers = isEditable
    ? {
        onMouseDown,
        onMouseEnter,
        onMouseUp,
      }
    : {};

  // Cursor and interaction styling
  const cursorClass = isEditable ? 'cursor-pointer' : 'cursor-default';

  return (
    <div
      className={`${baseClass} ${bgClass} ${textClass} ${textSizeClass} ${cursorClass}`}
      style={bgStyle}
      {...eventHandlers}
      title={
        !isEditable && action
          ? `${hand} (${action}) - Switch to Edit Mode to modify`
          : undefined
      }
    >
      <span>{hand}</span>
    </div>
  );
}
