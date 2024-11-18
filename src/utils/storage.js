const STORAGE_KEY = 'poker-ranges';

/**
 * Saves a range configuration to local storage
 * @param {string} position - The position (e.g., 'BTN', 'CO', etc.)
 * @param {Object} rangeData - The range configuration for the position
 * @returns {Promise<boolean>} - Success status
 */
export const saveRange = async (position, rangeData) => {
  try {
    // Get existing ranges
    const existingRanges = await getAllRanges();

    // Update ranges with new data
    const updatedRanges = {
      ...existingRanges,
      [position]: rangeData,
    };

    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRanges));
    return true;
  } catch (error) {
    console.error('Error saving range:', error);
    return false;
  }
};

/**
 * Retrieves a specific range configuration from local storage
 * @param {string} position - The position to retrieve
 * @returns {Promise<Object|null>} - The range configuration or null if not found
 */
export const getRange = async position => {
  try {
    const ranges = await getAllRanges();
    return ranges[position] || null;
  } catch (error) {
    console.error('Error getting range:', error);
    return null;
  }
};

/**
 * Retrieves all saved ranges from local storage
 * @returns {Promise<Object>} - Object containing all saved ranges
 */
export const getAllRanges = async () => {
  try {
    const rangesJSON = localStorage.getItem(STORAGE_KEY);
    return rangesJSON ? JSON.parse(rangesJSON) : {};
  } catch (error) {
    console.error('Error getting all ranges:', error);
    return {};
  }
};
