/**
 * Extracts RGB values from Tailwind color classes
 * @param {string} bgClass - Tailwind background color class (e.g., 'bg-red-500')
 * @returns {Object} RGB values or null if not found
 */
const getTailwindRGB = bgClass => {
  // Mapping of some Tailwind colors to RGB values
  const colorMap = {
    'bg-red-500': { r: 239, g: 68, b: 68 }, // #ef4444
    'bg-red-800': { r: 153, g: 27, b: 27 }, // #991b1b
    'bg-red-900': { r: 127, g: 29, b: 29 }, // #7f1d1d
    'bg-blue-200': { r: 191, g: 219, b: 254 }, // #bfdbfe
    'bg-blue-300': { r: 147, g: 197, b: 253 }, // #93c5fd
    'bg-gray-300': { r: 209, g: 213, b: 219 }, // #d1d5db
    'bg-gray-400': { r: 156, g: 163, b: 175 }, // ##9ca3af
    // Add more color mappings as needed
  };

  return colorMap[bgClass] || null;
};

/**
 * Calculates relative luminance of a color
 * Using the formula from WCAG 2.0
 */
const getLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Determines whether text should be light or dark based on background color
 * @param {string} bgClass - Tailwind background color class
 * @returns {string} Tailwind text color class
 */
export const getContrastText = bgClass => {
  const rgb = getTailwindRGB(bgClass);
  if (!rgb) return 'text-gray-800'; // Default to dark text

  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  // Using WCAG recommended contrast ratio threshold
  return luminance > 0.5 ? 'text-gray-800' : 'text-white';
};
