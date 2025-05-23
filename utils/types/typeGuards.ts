export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

export function isUndefined<T>(value: T | undefined): value is undefined {
  return value === undefined
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

export function isNull<T>(value: T | null): value is null {
  return value === null
}

export function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined
}

export function isNotBlankString(value: string): value is string {
  return value.trim() !== ''
}

export function isBlankString(value: string): value is string {
  return value.trim() === ''
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}
