'use client';

import { useEffect, useState } from 'react';

import { Check, Palette, Redo2, RotateCcw, Undo2 } from 'lucide-react';

import { ACTIONS } from '@/constants/actions';
import { useRange } from '@/contexts/RangeContext';
import { getContrastText, hexToRGB } from '@/utils/colorUtils';

// Default colors matching your existing color scheme
const DEFAULT_COLORS = {
  RAISE: '#991b1b', // bg-red-800
  CALL: '#bfdbfe', // bg-blue-200
  FOLD: '#d1d5db', // bg-gray-300
};

// Color presets for quick selection - arranged by tones
const COLOR_PRESETS = {
  RAISE: [
    '#991b1b', // Default dark red
    '#dc2626', // Bright red
    '#ec4899', // Pink
    '#f97316', // Orange
    '#f59e0b', // Amber (new warm color)
    '#eab308', // Yellow
  ],
  CALL: [
    '#bfdbfe', // Default light blue
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#10b981', // Green
  ],
  FOLD: [
    '#d1d5db', // Default gray
    '#f3f4f6', // Lightest gray
    '#e5e7eb', // Light gray
    '#9ca3af', // Medium gray
    '#6b7280', // Darker gray
    '#374151', // Darkest gray
  ],
};

export default function ColorPicker({ selectedAction, onActionSelect }) {
  const { state, updateColors } = useRange();
  // Always start with default colors for SSR consistency
  const [customColors, setCustomColors] = useState(DEFAULT_COLORS);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [colorHistory, setColorHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load saved colors after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('poker-custom-colors');
      if (saved) {
        try {
          const parsedColors = JSON.parse(saved);
          setCustomColors(parsedColors);
        } catch (error) {
          console.error('Failed to parse saved colors:', error);
        }
      }
    }
  }, []); // Run once on mount

  // Save custom colors to localStorage whenever they change
  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      localStorage.setItem('poker-custom-colors', JSON.stringify(customColors));
    }
    // Update the context with new colors
    updateColors(customColors);
  }, [customColors, updateColors]);

  // Add to history when colors change (but not from undo/redo)
  const addToHistory = (colors, fromUndoRedo = false) => {
    if (!fromUndoRedo) {
      const newHistory = [...colorHistory.slice(0, historyIndex + 1), colors];
      setColorHistory(newHistory.slice(-20)); // Keep last 20 states
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleColorChange = (action, color) => {
    const newColors = {
      ...customColors,
      [action]: color,
    };
    setCustomColors(newColors);
    addToHistory(newColors);
  };

  const resetToDefaults = () => {
    // Save current state to history before resetting
    addToHistory(customColors);
    setCustomColors(DEFAULT_COLORS);
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      localStorage.removeItem('poker-custom-colors');
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCustomColors(colorHistory[newIndex]);
      addToHistory(colorHistory[newIndex], true);
    }
  };

  const redo = () => {
    if (historyIndex < colorHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCustomColors(colorHistory[newIndex]);
      addToHistory(colorHistory[newIndex], true);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < colorHistory.length - 1;

  const hexToTailwindClass = hex => {
    // Convert hex color to inline style for dynamic coloring
    return { backgroundColor: hex };
  };

  // Use the same contrast calculation as GridCell for consistency
  const getTextColor = bgColor => {
    return getContrastText(bgColor);
  };

  return (
    <div className="color-picker-container">
      {/* Action Selector Buttons */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-2 flex-1">
          {Object.values(ACTIONS)
            .filter(action => action !== null)
            .map(action => {
              const bgColor = customColors[action];
              const textColor = getTextColor(bgColor);
              const isSelected = action === selectedAction;

              return (
                <button
                  key={action}
                  className={`flex items-center justify-center h-10 gap-2 px-4 py-2 
                    action-button transition-all duration-200
                    ${isSelected ? 'ring-2 ring-offset-2 ring-gray-600 shadow-lg' : 'hover:shadow-md'}
                    ${textColor}`}
                  style={hexToTailwindClass(bgColor)}
                  onClick={() => onActionSelect(action)}
                  aria-pressed={isSelected}
                  title={`${action} - Click to select`}
                >
                  {action.charAt(0) + action.slice(1).toLowerCase()}
                </button>
              );
            })}
        </div>

        {/* Color Customization Toggle */}
        <button
          onClick={() => setShowColorPanel(!showColorPanel)}
          className={`p-2 rounded-lg transition-colors
            ${
              showColorPanel
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          title="Customize colors"
          aria-label="Toggle color customization panel"
        >
          <Palette size={20} />
        </button>
      </div>

      {/* Color Customization Panel */}
      {showColorPanel && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Customize Action Colors
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`flex items-center gap-1 px-2 py-1 text-xs
                  rounded transition-colors
                  ${
                    canUndo
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                title="Undo last color change"
                aria-label="Undo"
              >
                <Undo2 size={14} />
                Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`flex items-center gap-1 px-2 py-1 text-xs
                  rounded transition-colors
                  ${
                    canRedo
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                title="Redo last undone change"
                aria-label="Redo"
              >
                <Redo2 size={14} />
                Redo
              </button>
              <button
                onClick={resetToDefaults}
                className="flex items-center gap-1 px-2 py-1 text-xs
                  bg-gray-100 hover:bg-gray-200 rounded transition-colors
                  text-gray-600 hover:text-gray-800"
                title="Reset all colors to defaults"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>

          {/* Color customization for each action */}
          {Object.values(ACTIONS)
            .filter(action => action !== null)
            .map(action => (
              <div key={action} className="mb-3 last:mb-0">
                <div className="flex items-center gap-3">
                  {/* Action label */}
                  <div className="w-16">
                    <label className="text-sm font-medium text-gray-600">
                      {action.charAt(0) + action.slice(1).toLowerCase()}
                    </label>
                  </div>

                  {/* Color presets */}
                  <div className="flex gap-1 flex-1">
                    {COLOR_PRESETS[action].map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorChange(action, preset)}
                        className={`w-8 h-8 rounded border-2 transition-all
                          ${
                            customColors[action] === preset
                              ? 'border-blue-500 shadow-lg scale-110'
                              : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                          }`}
                        style={hexToTailwindClass(preset)}
                        title={`Preset color: ${preset}`}
                        aria-label={`Select preset color ${preset} for ${action}`}
                      >
                        {customColors[action] === preset && (
                          <Check
                            size={16}
                            className={getContrastText(preset) + ' mx-auto'}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Current color display and controls */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border-2 border-gray-300 shadow-inner"
                      style={hexToTailwindClass(customColors[action])}
                      title={`Current color: ${customColors[action]}`}
                    />
                    <input
                      type="color"
                      value={customColors[action]}
                      onChange={e => handleColorChange(action, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0"
                      title="Click to pick a custom color"
                    />
                    <input
                      type="text"
                      value={customColors[action]}
                      onChange={e => {
                        const value = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                          if (value.length === 7) {
                            handleColorChange(action, value);
                          } else {
                            // Just update the display, don't save to history
                            setCustomColors(prev => ({
                              ...prev,
                              [action]: value,
                            }));
                          }
                        }
                      }}
                      className="w-20 px-2 py-1 text-xs border border-gray-300 rounded
                        focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      placeholder="#000000"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>
            ))}

          {/* Accessibility note */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic">
              💡 Tip: Choose colors with good contrast for better visibility.
              Consider colorblind users when selecting colors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
