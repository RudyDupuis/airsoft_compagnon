import { User } from '~/server/db/models/User'
import { isNullOrUndefined, isNull } from '~/utils/types/typeGuards'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (isNullOrUndefined(email) || isNullOrUndefined(password)) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.all-fields-required'
      }
    })
  }

  const user = await User.findOne({ where: { email } })

  if (isNull(user) || !(await verifyPassword(user.get('passwordHash'), password))) {
    throw createError({
      statusCode: 401,
      data: {
        errorKey: 'login.invalid-credentials'
      }
    })
  }

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
