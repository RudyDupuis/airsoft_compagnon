import { EventHandlerRequest, H3Event } from 'h3'
import { User } from '../db/entities/User'
import { isNull, isNullOrUndefined } from '~/utils/types/typeGuards'
import { errorResponse } from './response'
import { TypeORM } from '../db/config'

export async function standardizeUserSession(event: H3Event<EventHandlerRequest>, user: User) {
  return await setUserSession(event, {
    user: {
      id: user.id,
      pseudo: user.pseudo,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      isBanned: user.isBanned
    }
  })
}

export async function getSessionAndUser(event: H3Event<EventHandlerRequest>) {
  const session = await getUserSession(event)
  if (isNullOrUndefined(session) || isNullOrUndefined(session.user)) {
    throw errorResponse('common.errors.unauthorized', 401)
  }

  const userRepository = TypeORM.getRepository(User)
  const user = await userRepository.findOne({
    where: { id: session.user.id }
  })

  if (isNull(user)) {
    throw errorResponse('common.errors.user-not-found', 404)
  }

  if (user.isBanned) {
    throw errorResponse('common.errors.banned', 403)
  }

  const requiresUserSessionRefresh =
    user.pseudo !== session.user.pseudo ||
    user.isVerified !== session.user.isVerified ||
    user.isAdmin !== session.user.isAdmin ||
    user.isBanned !== session.user.isBanned

  if (requiresUserSessionRefresh) {
    await standardizeUserSession(event, user)
    setHeader(event, 'X-Refresh-Session', 'true')
  }

  return { session, user }
}

export function throwIfUserIsNotAdmin(user: User) {
  if (!user.isAdmin) {
    throw errorResponse('common.errors.not-admin', 403)
  }
}

export function throwIfUserIsNotVerified(user: User) {
  if (!user.isVerified) {
    throw errorResponse('common.errors.not-verified', 403)
  }
}
