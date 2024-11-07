'use client';

import { GRID_COLORS, TEXT_COLORS } from '@/constants/colors';
import { COLORS } from '@/constants/actions';
import { getContrastText } from '@/utils/colorUtils';

export default function GridCell({
  hand,
  action,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  const isPocketPair = hand.length === 2 && hand[0] === hand[1];

  const baseClass = 'grid-cell select-none';
  const bgClass = action
    ? COLORS[action]
    : isPocketPair
      ? GRID_COLORS.POCKET_PAIR
      : GRID_COLORS.OFFSUIT;
  const textClass = action ? getContrastText(bgClass) : TEXT_COLORS.DARK;

  return (
    <div
      className={`${baseClass} ${bgClass} ${textClass}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
    >
      <span>{hand}</span>
    </div>
  );
}
