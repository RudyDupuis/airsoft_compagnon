import { TypeORM } from '~/server/db/config'
import { User } from '~/server/db/entities/User'
import { isNotBlankString, isNull, isNullOrUndefined } from '~/utils/types/typeGuards'
import { isOfLegalAge } from '~/utils/validations/methods'
import { emailRegex, pseudoRegex, usernameRegex } from '~/utils/validations/regex'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (isNullOrUndefined(session) || isNullOrUndefined(session.user)) {
    throw createError({
      statusCode: 401,
      data: {
        errorKey: 'common.errors.unauthorized'
      }
    })
  }

  const { email, dateOfBirth, firstName, lastName, pseudo } = await readBody(event)

  if (
    isNullOrUndefined(email) ||
    isNullOrUndefined(dateOfBirth) ||
    isNullOrUndefined(firstName) ||
    isNullOrUndefined(lastName) ||
    isNullOrUndefined(pseudo)
  ) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.form.errors.all-fields-required'
      }
    })
  }

  if (
    (isNotBlankString(email) && !emailRegex.test(email)) ||
    (isNotBlankString(dateOfBirth) && !isOfLegalAge(dateOfBirth)) ||
    (isNotBlankString(firstName) && !usernameRegex.test(firstName)) ||
    (isNotBlankString(lastName) && !usernameRegex.test(lastName)) ||
    (isNotBlankString(pseudo) && !pseudoRegex.test(pseudo))
  ) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.form.errors.rules-not-respected'
      }
    })
  }

  const { id } = session.user
  const userRepository = TypeORM.getRepository(User)
  const user = await userRepository.findOne({ where: { id } })

  if (isNull(user)) {
    throw createError({
      statusCode: 404,
      data: {
        errorKey: 'common.errors.user-not-found'
      }
    })
  }

  Object.assign(user, { email, dateOfBirth, firstName, lastName, pseudo })

  await userRepository.save(user)

  await setUserSession(event, {
    user: {
      id: user.id,
      pseudo: user.pseudo,
      isVerified: user.isVerified
    }
  })

  return {
    id: user.id,
    email: user.email,
    pseudo: user.pseudo,
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    reputation: user.reputation,
    isVerified: user.isVerified
  }
})
