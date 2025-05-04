import { isNotBlankString, isNullOrUndefined } from '~/utils/types/typeGuards'
import { emailRegex } from '~/utils/validations/regex'

export default defineEventHandler(async (event) => {
  const { email, message } = await readBody(event)

  if (isNullOrUndefined(email) || isNullOrUndefined(message)) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.form.errors.all-fields-required'
      }
    })
  }

  if (isNotBlankString(email) && !emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.form.errors.rules-not-respected'
      }
    })
  }

  // TODO : send email

  return {
    status: 'ok'
  }
})
