export function isOfLegalAge(dateOfBirthString: string): boolean {
  const date = new Date(dateOfBirthString)
  const today = new Date()
  const age = today.getFullYear() - date.getFullYear()
  const monthDiff = today.getMonth() - date.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    return age >= 18
  }
  return age >= 18
}

export function isInFuture(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  return date > today
}

export function isPositiveNumber(value: number): boolean {
  return value > 0
}
