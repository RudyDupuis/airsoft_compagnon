import { User } from '~/server/db/entities/User'
import { emailRegex, nameRegex, passwordRegex, pseudoRegex } from '~/utils/validations/regex'
import { isNotBlankString, isNotNull, isNullOrUndefined } from '~/utils/types/typeGuards'
import { isOfLegalAge } from '~/utils/validations/methods'
import { TypeORM } from '~/server/db/config'

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

  const userRepository = TypeORM.getRepository(User)
  const existingUser = await userRepository.findOne({ where: { email } })

  if (isNotNull(existingUser)) {
    throw createError({
      statusCode: 409,
      data: {
        errorKey: 'register.email-already-exists'
      }
    })
  }

  const passwordHash = await hashPassword(password)
  const user = userRepository.create({
    email,
    passwordHash,
    dateOfBirth,
    firstName,
    lastName,
    pseudo
  })
  await userRepository.save(user)

  await setUserSession(event, {
    user: {
      id: user.id,
      pseudo: user.pseudo
    }
  })

  return {
    id: user.id,
    pseudo: user.pseudo
  }
})
