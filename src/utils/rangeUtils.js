/**
 * Validates the structure of imported range data
 * @param {Object} data - The data to validate
 * @returns {Object} - { isValid: boolean, error: string|null }
 */
export const validateRangeData = data => {
  try {
    // Check if data is an object
    if (typeof data !== 'object' || data === null) {
      return {
        isValid: false,
        error: 'Invalid data format: Expected an object',
      };
    }

    // Valid positions
    const validPositions = ['BTN', 'CO', 'HJ', 'LJ', 'SB', 'BB'];

    // Valid actions
    const validActions = ['RAISE', 'CALL', 'FOLD'];

    // Check each position's data
    for (const [position, ranges] of Object.entries(data)) {
      // Verify position is valid
      if (!validPositions.includes(position)) {
        return {
          isValid: false,
          error: `Invalid position: ${position}`,
        };
      }

      // Verify ranges is an object
      if (typeof ranges !== 'object' || ranges === null) {
        return {
          isValid: false,
          error: `Invalid ranges for position ${position}`,
        };
      }

      // Verify each hand's action
      for (const [hand, action] of Object.entries(ranges)) {
        if (!validActions.includes(action)) {
          return {
            isValid: false,
            error: `Invalid action "${action}" for hand ${hand} in position ${position}`,
          };
        }
      }
    }

    return { isValid: true, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: `Validation error: ${error.message}`,
    };
  }
};

/**
 * Exports all ranges to a JSON file
 * @param {Object} ranges - The ranges to export
 * @returns {string} - JSON filename
 */
export const exportRanges = ranges => {
  try {
    // Create JSON blob
    const jsonString = JSON.stringify(ranges, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `poker-ranges-${new Date().toISOString().split('T')[0]}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);

    return link.download;
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
};

/**
 * Imports ranges from a JSON file
 * @param {File} file - The JSON file to import
 * @returns {Promise<Object>} - The imported ranges data
 */
export const importRanges = async file => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // Validate imported data
    const { isValid, error } = validateRangeData(data);
    if (!isValid) {
      throw new Error(error);
    }

    return data;
  } catch (error) {
    throw new Error(`Import failed: ${error.message}`);
  }
};
