import { TypeORM } from '~/server/db/config'
import { User } from '~/server/db/entities/User'
import { successResponse } from '~/server/utils/response'
import { standardizeUserSession, getSessionAndUser } from '~/server/utils/userSession'
import { validateFieldRules, validateRequiredFields } from '~/server/utils/validation'
import { isNotBlankString, isString } from '~/utils/types/typeGuards'
import { isOfLegalAge } from '~/utils/validations/methods'
import { emailRegex, pseudoRegex, usernameRegex } from '~/utils/validations/regex'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)

  const body = await readBody(event)

  validateRequiredFields(body, ['email', 'dateOfBirth', 'firstName', 'lastName', 'pseudo'])
  validateFieldRules(body, {
    email: {
      check: (value) => isString(value) && isNotBlankString(value) && emailRegex.test(value)
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
  })

  Object.assign(user, {
    email: body.email,
    dateOfBirth: body.dateOfBirth,
    firstName: body.firstName,
    lastName: body.lastName,
    pseudo: body.pseudo
  })

  const userRepository = TypeORM.getRepository(User)
  await userRepository.save(user)

  await standardizeUserSession(event, user)

  return successResponse('User updated successfully')
})
