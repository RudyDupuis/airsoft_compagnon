import { TypeORM } from '~/server/db/config'
import { User } from '~/server/db/entities/User'
import { errorResponse, successResponse } from '~/server/utils/response'
import { getSessionAndUser } from '~/server/utils/userSession'
import { validateFieldRules, validateRequiredFields } from '~/server/utils/validation'
import { isNotBlankString, isString } from '~/utils/types/typeGuards'
import { passwordRegex } from '~/utils/validations/regex'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)

  const body = await readBody(event)

  validateRequiredFields(body, ['oldPassword', 'newPassword'])
  validateFieldRules(body, {
    newPassword: {
      check: (value) => isString(value) && isNotBlankString(value) && passwordRegex.test(value)
    }
  })

  if (!(await verifyPassword(user.passwordHash, body.oldPassword))) {
    throw errorResponse('pages.me.errors.invalid-old-password', 401)
  }

  const userRepository = TypeORM.getRepository(User)
  user.passwordHash = await hashPassword(newPassword)
  await userRepository.save(user)

  return successResponse('Password updated successfully')
})
