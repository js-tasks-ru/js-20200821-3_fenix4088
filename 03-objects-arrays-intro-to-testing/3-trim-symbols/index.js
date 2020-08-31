/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let counter = 1;
  let result = "";
  let char = "";
  for (let i = 0; i < string.length; i++) {
    if (string[i] !== string[i - 1]) {
      char = string[i];
      counter = 1;
    } else if (string[i] === string[i - 1]) {
      counter++;
    }
    if (counter <= size) {
      result += char;
    } else if (size === undefined) {
      result += char;
    }
  }
  return result;
}
