export function isObject(value: Object) {
  return Object.prototype.toString.call(value) === '[object Object]'
}
