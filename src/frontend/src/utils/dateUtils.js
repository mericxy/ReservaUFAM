export const generateTimeOptions = () => {
  const options = [];
  for (let hour = 7; hour < 23; hour++) {
    const formattedHour = hour.toString().padStart(2, '0');
    options.push(`${formattedHour}:00`, `${formattedHour}:30`);
  }
  return options;
};

export const getFinalTimeOptions = (initialTime, initialDate, finalDate) => {
  if (!initialTime || !initialDate || !finalDate) return [];
  const initial = new Date(initialDate);
  const final = new Date(finalDate);
  if (initial.getTime() !== final.getTime()) return generateTimeOptions();
  const all = generateTimeOptions();
  const index = all.findIndex(time => time === initialTime);
  return index === -1 ? [] : all.slice(index + 1);
};

export const getMinDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 2);
  return today.toISOString().split("T")[0];
};
