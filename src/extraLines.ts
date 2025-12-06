export const extraLines = [
  "1 MON and a dream",
];

export const getRandomLine = (): string => {
  return extraLines[Math.floor(Math.random() * extraLines.length)];
};