export function successResponse(message: string) {
  return {
    success: true,
    message
  }
}

export function errorResponse(errorKey: string, statusCode: number = 400) {
  return createError({
    statusCode,
    data: {
      errorKey
    }
  })
}

export function consoleError(message: string, userId: number, requestName: string) {
  console.error(
    '\x1b[31m%s\x1b[0m', // Red color for error
    `REQUEST: ${requestName} -> USER_ID: ${userId}\n${message}`
  )
}
