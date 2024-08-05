export function deepCopy(obj: Object): Object {
  return JSON.parse(JSON.stringify(obj))
}
