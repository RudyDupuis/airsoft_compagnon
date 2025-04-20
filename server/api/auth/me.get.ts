import { User } from '~/server/db/models/User'
import { isNull, isNullOrUndefined } from '~/utils/types/typeGuards'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (isNullOrUndefined(session) || isNullOrUndefined(session.user)) {
    throw createError({
      statusCode: 401,
      data: {
        errorKey: 'me.unauthorized'
      }
    })
  }

  const { id } = session.user
  const user = await User.findOne({ where: { id } })

  if (isNull(user)) {
    throw createError({
      statusCode: 404,
      data: {
        errorKey: 'me.user-not-found'
      }
    })
  }

  return {
    id: user.get('id'),
    email: user.get('email'),
    pseudo: user.get('pseudo'),
    firstName: user.get('firstName'),
    lastName: user.get('lastName'),
    dateOfBirth: user.get('dateOfBirth')
  }
})
