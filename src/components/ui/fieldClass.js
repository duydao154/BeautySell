export function fieldClass(hasError, type = 'input') {
  return `${type} ${hasError ? `${type}--error` : ''}`
}
