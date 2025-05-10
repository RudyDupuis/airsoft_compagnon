import { isNullOrUndefined } from '~/utils/types/typeGuards'
import { consoleError, errorResponse } from './response'

interface Fields {
  [key: string]: unknown
}

interface Rules {
  [fieldName: string]: { check: (value: unknown) => boolean }
}

export function validateRequiredFields(
  fields: Fields,
  fieldNames: string[],
  userId: number,
  requestName: string
): void {
  const missingFields = fieldNames.filter((field) => isNullOrUndefined(fields[field]))
  if (missingFields.length > 0) {
    consoleError(`Missing fields: ${missingFields}`, userId, requestName)
    throw errorResponse('common.form.errors.all-fields-required')
  }
}

export function validateFieldRules(
  fields: Fields,
  rules: Rules,
  userId: number,
  requestName: string
): void {
  const invalidFields = Object.keys(rules).filter((field) => {
    return rules[field].check(fields[field]) === false
  })

  if (invalidFields.length > 0) {
    consoleError(
      `Invalid fields: ${invalidFields}\nInvalid fields values: ${invalidFields.map((field) => fields[field])}`,
      userId,
      requestName
    )
    throw errorResponse('common.form.errors.rules-not-respected')
  }
}

export function throwIfIdIsNaN(id: unknown, userId: number, requestName: string) {
  if (isNullOrUndefined(id) || isNaN(Number(id))) {
    consoleError(`Invalid ID: ${id}`, userId, requestName)
    throw errorResponse('common.errors.invalid-id')
  }
}

export function throwIfObjectIsNotFound<T>(
  object: T | null,
  objectType: string,
  objectId: number,
  userId: number,
  requestName: string
): asserts object is T {
  if (isNullOrUndefined(object)) {
    consoleError(`Object not found, ID: ${objectId}, Type: ${objectType}`, userId, requestName)
    throw errorResponse('common.errors.not-found')
  }
}
