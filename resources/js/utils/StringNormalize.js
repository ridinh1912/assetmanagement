export const normalizeString = (str) => {
  // return str.toLowerCase().split(' ').filter(c => c !== '').join(' ')
  return str.toLowerCase().replace(/  +/g, ' ').trim();
};
export const normalizeSpace = (str) => {
  return str.replace(/  +/g, ' ');
};
