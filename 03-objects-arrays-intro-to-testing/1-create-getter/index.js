/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(field) {
    const stringArr = field.split(".");
    return function (obj) {
        if (Object.keys(obj).length !== 0) {
            const path = stringArr.reduce((acc, curentVal) => {
                return acc[curentVal];
            }, obj);
            return path;
        }
    };
}
