import { hu } from './hu'

export function useTranslation() {
  return { t: hu }
}

export function t(key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.')
  let value: any = hu

  for (const k of keys) {
    value = value?.[k]
  }

  if (typeof value !== 'string') {
    return key
  }

  if (params) {
    return Object.entries(params).reduce(
      (str, [key, val]) => str.replace(`{${key}}`, String(val)),
      value
    )
  }

  return value
}
