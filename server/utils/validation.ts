import { isNullOrUndefined } from '~/utils/types/typeGuards'
import { errorResponse } from './response'

interface Fields {
  [key: string]: unknown
}

interface Rules {
  [fieldName: string]: { check: (value: unknown) => boolean }
}

export function validateRequiredFields(fields: Fields, fieldNames: string[]) {
  const missingFields = fieldNames.filter((field) => isNullOrUndefined(fields[field]))
  if (missingFields.length > 0) {
    throw errorResponse('common.form.errors.all-fields-required')
  }
}

export function validateFieldRules(fields: Fields, rules: Rules): void {
  const invalidFields = Object.keys(rules).filter((field) => {
    return rules[field].check(fields[field]) === false
  })

  if (invalidFields.length > 0) {
    throw errorResponse('common.form.errors.rules-not-respected')
  }
}

export function throwIfIdIsNaN(id: unknown) {
  if (isNullOrUndefined(id) || isNaN(Number(id))) {
    throw errorResponse('common.errors.invalid-id')
  }
}

export function throwIfObjectIsNotFound<T>(object: T | null): asserts object is T {
  if (isNullOrUndefined(object)) {
    throw errorResponse('common.errors.not-found')
  }
}
