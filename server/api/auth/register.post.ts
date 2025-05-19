import { User } from '~/server/db/entities/User'
import { emailRegex, usernameRegex, passwordRegex, pseudoRegex } from '~/utils/validations/regex'
import { isNotBlankString, isNotNull, isString } from '~/utils/types/typeGuards'
import { isOfLegalAge } from '~/utils/validations/methods'
import { TypeORM } from '~/server/db/config'
import { standardizeUserSession } from '~/server/utils/userSession'
import { validateFieldRules, validateRequiredFields } from '~/server/utils/validation'
import { errorResponse, successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  validateRequiredFields(
    body,
    ['email', 'password', 'dateOfBirth', 'firstName', 'lastName', 'pseudo'],
    0,
    'register'
  )
  validateFieldRules(
    body,
    {
      email: {
        check: (value) => isString(value) && isNotBlankString(value) && emailRegex.test(value)
      },
      password: {
        check: (value) => isString(value) && isNotBlankString(value) && passwordRegex.test(value)
      },
      dateOfBirth: {
        check: (value) => isString(value) && isNotBlankString(value) && isOfLegalAge(value)
      },
      firstName: {
        check: (value) => isString(value) && isNotBlankString(value) && usernameRegex.test(value)
      },
      lastName: {
        check: (value) => isString(value) && isNotBlankString(value) && usernameRegex.test(value)
      },
      pseudo: {
        check: (value) => isString(value) && isNotBlankString(value) && pseudoRegex.test(value)
      }
    },
    0,
    'register'
  )

  const userRepository = TypeORM.getRepository(User)
  const existingUser = await userRepository.findOne({ where: { email: body.email } })

  if (isNotNull(existingUser)) {
    throw errorResponse('entities.user.errors.email-already-exists', 409)
  }

  const passwordHash = await hashPassword(body.password)
  const user = userRepository.create({
    email: body.email,
    passwordHash,
    dateOfBirth: body.dateOfBirth,
    firstName: body.firstName,
    lastName: body.lastName,
    pseudo: body.pseudo
  })
  await userRepository.save(user)

  await standardizeUserSession(event, user)

  return successResponse('User registered successfully')
})
