/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {

  // * Решение №2
  // С использование деструктуризации но сортировка происходит таким же образом как и в первом решении
  
  const [cf, dir] = param === "asc" ? ["upper", 1] : ["lower", -1];
  const newArr = [...arr];
  return newArr.sort((a, b) => {
    return a.localeCompare(b, "ru", { caseFirst: cf }) * dir;
  });





  // * Решение №1
  // //Разделяем каждый элемент массива на обьект {value, index}
  // let newArr = arr.map((element, index) => {
  //   return { value: element, index };
  // });

  // //  Сортируем эти обьекты по их свойству value
  // newArr.sort((a, b) => {
  //   const aProp = a.value;
  //   const bProp = b.value;
  //   // Сортировка по заглавным буквам и особенностям языка
  //   return aProp.localeCompare(bProp, "ru", { caseFirst: "upper" });
  // });
  // //   Возвразаем массив обьектов в его первоначальный вид
  // const result = newArr.map((element) => {
  //   return arr[element.index];
  // });

  // if (param === "asc") {
  //   return result;
  // } else {
  //   return result.reverse();
  // }

  // * Решение №3
  //   Анлогично решению №1 только используем пустой массив и обьеденяем его с уже отсортироаным
  /*
  let newArr = [];
  arr.sort((a, b) => {
    return a.localeCompare(b, "ru", { caseFirst: "upper" });
  });

  if (param === "asc") {
    return (newArr = newArr.concat(arr));
  } else {
    return (newArr = newArr.concat(arr.reverse()));
  }
  */
}
