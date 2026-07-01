function getNestedValue(messages, key) {
  const parts = key.split('.')
  let current = messages

  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = current[part]
  }

  return typeof current === 'string' ? current : undefined
}

function interpolate(template, vars = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) =>
    vars[name] != null ? String(vars[name]) : `{{${name}}}`,
  )
}

export function createTranslator(messages) {
  function t(key, vars) {
    const template = getNestedValue(messages, key)
    if (!template) return key
    return vars ? interpolate(template, vars) : template
  }

  function plural(count, oneKey, otherKey, vars) {
    return t(count === 1 ? oneKey : otherKey, { count, ...vars })
  }

  return { t, plural }
}
