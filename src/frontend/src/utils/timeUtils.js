/**
 * @param {string} occupiedDates
 * @param {Array} occupiedDates
 * @param {Array} timeOptions
 * @returns {Set<string>}
 */
export const getOccupiedTimesSet = (date, occupiedDates, timeOptions) => {
  const occupiedSet = new Set();
  if (!date || !occupiedDates || !timeOptions) return occupiedSet;

  const relevantBookings = occupiedDates.filter(b => b.date === date);
  if (!relevantBookings.length) return occupiedSet;

  for (const booking of relevantBookings) {
    const initial_time_normalized = booking.initial_time.slice(0, 5); 
    const final_time_normalized = booking.final_time.slice(0, 5);     

    const startIndex = timeOptions.indexOf(initial_time_normalized);
    const endIndex = timeOptions.indexOf(final_time_normalized);

    if (startIndex > -1 && endIndex > -1) {
      for (let i = startIndex; i < endIndex; i++) {
        occupiedSet.add(timeOptions[i]);
      }
    }
  }
  
  return occupiedSet;
};

export const isSlotOccupied = (day, initialTime, finalTime, occupiedDates, timeOptions) => {
  if (!day || !initialTime || !finalTime) return false;

  const year = day.getUTCFullYear();
  const month = (day.getUTCMonth() + 1).toString().padStart(2, '0');
  const dayOfMonth = day.getUTCDate().toString().padStart(2, '0');
  const dateString = `${year}-${month}-${dayOfMonth}`;
  
  const occupiedSet = getOccupiedTimesSet(dateString, occupiedDates, timeOptions);
  if (occupiedSet.size === 0) return false; 

  const startIndex = timeOptions.indexOf(initialTime);
  const endIndex = timeOptions.indexOf(finalTime);

  if (startIndex === -1 || endIndex === -1) return false; 

  for (let i = startIndex; i < endIndex; i++) {
    if (occupiedSet.has(timeOptions[i])) {
      return true; 
    }
  }

  return false;
};