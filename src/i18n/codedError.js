/**
 * @param {string} code - i18n message key
 * @param {Record<string, string | number>} [vars]
 */
export function createCodedError(code, vars) {
  const error = new Error(code)
  error.code = code
  error.vars = vars
  return error
}
