// List of all card ranks from highest to lowest
export const RANKS = [
  'A',
  'K',
  'Q',
  'J',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
];

// Generate all possible hands in a 13x13 grid
export const generateHands = () => {
  const grid = [];

  for (let i = 0; i < RANKS.length; i++) {
    const row = [];
    for (let j = 0; j < RANKS.length; j++) {
      if (i === j) {
        // Pocket pairs
        row.push(`${RANKS[i]}${RANKS[i]}`);
      } else if (i < j) {
        // Suited hands
        row.push(`${RANKS[i]}${RANKS[j]}s`);
      } else {
        // Off-suit hands
        row.push(`${RANKS[j]}${RANKS[i]}o`);
      }
    }
    grid.push(row);
  }

  return grid;
};
