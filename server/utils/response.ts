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
