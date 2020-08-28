/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...keys) => {
  const propertiesArr = Object.entries(obj);
  const newObj = {};
  // Перебираем массив propertiesArr
  propertiesArr.forEach((item) => {
    // если массив из spread параметров НЕ содержит item[0]
    if (!keys.includes(item[0])) {
      // Тогда мы записываем в новый обьект свойство с ключем которое подпадает под условие
      // и под этим ключем заключяем значение, взятое из свойств входного обьекта под таким же именем ключа
      newObj[item[0]] = obj[item[0]];
    }
  });
  return newObj;
};
