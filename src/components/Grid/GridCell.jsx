'use client';

export default function GridCell({ hand, action, onClick }) {
  // Determine if the hand is a pocket pair
  const isPocketPair = hand.length === 2 && hand[0] === hand[1];

  return (
    <div
      className={`
        aspect-square
        flex items-center justify-center
        cursor-pointer transition-colors duration-200
        border border-gray-300
        ${action ? colors[action] : isPocketPair ? 'bg-[#f5f7f5]' : 'bg-[#eef2ee]'}
        hover:bg-[#dce3dc]
        text-gray-800
      `}
      onClick={() => onClick(hand)}
    >
      <span className="text-lg">{hand}</span>
    </div>
  );
}
