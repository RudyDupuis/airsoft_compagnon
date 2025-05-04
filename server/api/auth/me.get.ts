import { TypeORM } from '~/server/db/config'
import { User } from '~/server/db/entities/User'
import { isNull, isNullOrUndefined } from '~/utils/types/typeGuards'

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

  return {
    id: user.id,
    email: user.email,
    pseudo: user.pseudo,
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    isVerified: user.isVerified
  }
})
