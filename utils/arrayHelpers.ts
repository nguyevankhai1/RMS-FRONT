const addItem = (targetArray: any[], item: any, key: string) => {
  if (findItem(targetArray, item, key) !== -1) return removeItem(targetArray, item, key);
  return [...targetArray, item];
};

const removeItem = (targetArray: any[], removedItem: any, key: string) => {
  return targetArray.filter((i) => i[key] !== removedItem[key]);
};

const isValidArray = (arr: any[]) => {
  return Array.isArray(arr) && arr.length > 0;
};

const getUniqueItems = <T>(arr: T[]): T[] => {
  return arr.filter((i, idx) => arr.indexOf(i) === idx);
};

const findItem = (a: any[], o: any, k: string) => a.find((i) => i[k] === o[k]) || -1;

export { addItem, isValidArray, getUniqueItems, findItem, removeItem };
