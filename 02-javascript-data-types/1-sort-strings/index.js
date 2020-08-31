/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
  const direction = param === "asc" ?  1 : -1;
  const newArr = [...arr];
  return newArr.sort((a, b) => {
    return a.localeCompare(b, "ru", { caseFirst: 'upper' }) * direction;
  });
}
