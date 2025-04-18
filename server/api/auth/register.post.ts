import { User } from '~/server/db/models/User.model'
import { emailRegex, nameRegex, passwordRegex, pseudoRegex } from '~/utils/validations/regex'
import { isNotBlankString, isNotNull, isNullOrUndefined } from '~/utils/types/typeGuards'
import { isOfLegalAge } from '~/utils/validations/methods'

export default defineEventHandler(async (event) => {
  const { email, password, dateOfBirth, firstName, lastName, pseudo } = await readBody(event)

  if (
    isNullOrUndefined(email) ||
    isNullOrUndefined(password) ||
    isNullOrUndefined(dateOfBirth) ||
    isNullOrUndefined(firstName) ||
    isNullOrUndefined(lastName) ||
    isNullOrUndefined(pseudo)
  ) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.all-fields-required'
      }
    })
  }

  if (
    (isNotBlankString(email) && !emailRegex.test(email)) ||
    (isNotBlankString(password) && !passwordRegex.test(password)) ||
    (isNotBlankString(dateOfBirth) && !isOfLegalAge(dateOfBirth)) ||
    (isNotBlankString(firstName) && !nameRegex.test(firstName)) ||
    (isNotBlankString(lastName) && !nameRegex.test(lastName)) ||
    (isNotBlankString(pseudo) && !pseudoRegex.test(pseudo))
  ) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.rules-not-respected'
      }
    })
  }

  const existingUser = await User.findOne({ where: { email } })

  if (isNotNull(existingUser)) {
    throw createError({
      statusCode: 409,
      data: {
        errorKey: 'register.email-already-exists'
      }
    })
  }

  const passwordHash = await hashPassword(password)
  const user = await User.create({
    email,
    passwordHash,
    dateOfBirth,
    firstName,
    lastName,
    pseudo
  })

  await setUserSession(event, {
    user: {
      id: user.get('id'),
      pseudo: user.get('pseudo')
    }
  })

  return {
    id: user.get('id'),
    pseudo: user.get('pseudo')
  }
})
