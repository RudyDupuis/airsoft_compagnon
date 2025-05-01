import { TypeORM } from '~/server/db/config'
import { User } from '~/server/db/entities/User'
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

  const userRepository = TypeORM.getRepository(User)
  const user = await userRepository.findOne({ where: { email } })

  if (isNull(user) || !(await verifyPassword(user.passwordHash, password))) {
    throw createError({
      statusCode: 401,
      data: {
        errorKey: 'login.invalid-credentials'
      }
    })
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      pseudo: user.pseudo,
      isVerified: user.isVerified
    }
  })

  return {
    id: user.id,
    pseudo: user.pseudo,
    isVerified: user.isVerified
  }
})
