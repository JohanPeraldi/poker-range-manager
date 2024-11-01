'use client';

import { CELL_COLORS } from '@/constants/actions';

export default function GridCell({ hand, action, onClick }) {
  const isPocketPair = hand.length === 2 && hand[0] === hand[1];

  // Base classes that are always applied
  const baseClasses = [
    'aspect-square',
    'flex',
    'items-center',
    'justify-center',
    'cursor-pointer',
    'transition-colors',
    'duration-200',
    'border',
    'border-gray-300',
    'text-gray-800',
  ];

  // Debug the values
  console.log('Rendering cell:', {
    hand,
    action,
    bgColor: action ? CELL_COLORS[action] : null,
  });

  // Background color class - action color takes precedence
  let bgClass;
  if (action && CELL_COLORS[action]) {
    bgClass = CELL_COLORS[action]; // This should be 'bg-red-500', 'bg-blue-200', or 'bg-gray-300'
  } else {
    bgClass = isPocketPair ? 'bg-[#f5f7f5]' : 'bg-[#eef2ee]';
  }

  // Combine all classes
  const className = [...baseClasses, bgClass, 'hover:brightness-95'].join(' ');

  return (
    <div className={className} onClick={() => onClick(hand)}>
      <span className="text-sm">{hand}</span>
    </div>
  );
}
