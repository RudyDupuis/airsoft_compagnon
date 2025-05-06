import { TypeORM } from '~/server/db/config'
import { User } from '~/server/db/entities/User'
import { isNotBlankString, isNull, isNullOrUndefined } from '~/utils/types/typeGuards'
import { passwordRegex } from '~/utils/validations/regex'

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

  const { oldPassword, newPassword } = await readBody(event)

  if (isNullOrUndefined(oldPassword) || isNullOrUndefined(newPassword)) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.form.errors.all-fields-required'
      }
    })
  }

  if (isNotBlankString(newPassword) && !passwordRegex.test(newPassword)) {
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

  if (!(await verifyPassword(user.passwordHash, oldPassword))) {
    throw createError({
      statusCode: 401,
      data: {
        errorKey: 'pages.me.errors.invalid-old-password'
      }
    })
  }

  user.passwordHash = await hashPassword(newPassword)
  await userRepository.save(user)

  return {
    success: true,
    message: 'Password updated successfully'
  }
})
