import { TypeORM } from '~/server/db/config'
import { User } from '~/server/db/entities/User'
import { errorResponse, successResponse } from '~/server/utils/response'
import { standardizeUserSession } from '~/server/utils/userSession'
import { validateRequiredFields } from '~/server/utils/validation'
import { isNull } from '~/utils/types/typeGuards'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  validateRequiredFields(body, ['email', 'password'], 0, 'login')

  const userRepository = TypeORM.getRepository(User)
  const user = await userRepository.findOne({ where: { email: body.email } })

  if (isNull(user) || !(await verifyPassword(user.passwordHash, body.password))) {
    throw errorResponse('pages.login.errors.invalid-credentials', 401)
  }

  if (user.isBanned) {
    throw errorResponse('common.errors.banned', 403)
  }

  await standardizeUserSession(event, user)

  return successResponse('User logged in successfully')
})
