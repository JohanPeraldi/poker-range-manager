'use client';

import { COLORS } from '@/constants/actions';
import { getContrastText } from '@/utils/colorUtils';

export default function GridCell({ hand, action, onClick }) {
  const isPocketPair = hand.length === 2 && hand[0] === hand[1];

  const baseClass =
    'aspect-square flex items-center justify-center cursor-pointer border border-gray-300';
  const bgClass = action
    ? COLORS[action]
    : isPocketPair
      ? 'bg-[#f5f7f5]'
      : 'bg-[#eef2ee]';
  const textClass = action ? getContrastText(bgClass) : 'text-gray-800';

  return (
    <div
      className={`${baseClass} ${bgClass} ${textClass} hover:brightness-95`}
      onClick={() => onClick(hand)}
    >
      <span className="text-sm">{hand}</span>
    </div>
  );
}
