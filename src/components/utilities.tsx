export function hasDuplication(array: any[]) {
  return new Set(array).size !== array.length
}
