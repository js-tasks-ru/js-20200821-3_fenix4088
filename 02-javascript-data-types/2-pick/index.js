/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...keys) => {
  const propertiesArr = Object.entries(obj);
  const newObj = {};
  // Перебираем массив propertiesArr
  propertiesArr.forEach((item) => {
    // если массив из spread параметров содержит item[0]
    if (keys.includes(item[0])) {
      // Тогда мы записываем в новый обьект свойство с ключем которое подпадает под условие
      // и под этим ключем заключяем значение, взятое из свойств входного обьекта под таким же именем ключа
      newObj[item[0]] = obj[item[0]];
    }
  });
  return newObj;
};

// Второй вариант без include, через циклы
/*
  export const pick = (obj, ...keys) => {
    const propertiesArr = Object.entries(obj);
    const newObj = {};
    // Перебираем массив propertiesArr
    propertiesArr.forEach((eachArr) => {
      // Перебераем все spread параметры
      keys.forEach((key) => {
        // если параметр === свойству обьекта
        if (key === eachArr[0]) {
          // записываем это свойство в новый обьект
          newObj[key] = eachArr[1];
        }
      });
    });
  
    return newObj;
  };
  */
