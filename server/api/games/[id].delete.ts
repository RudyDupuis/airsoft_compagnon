import { Game } from '~/server/db/entities/Game'
import { TypeORM } from '~/server/db/config'
import { isNull, isNullOrUndefined } from '~/utils/types/typeGuards'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (isNullOrUndefined(session) || isNullOrUndefined(session.user) || !session.user.isVerified) {
    throw createError({
      statusCode: 401,
      data: {
        errorKey: 'common.unauthorized'
      }
    })
  }

  const id = Number(event.context.params?.id)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.invalid-id'
      }
    })
  }

  const gameRepository = TypeORM.getRepository(Game)

  const game = await gameRepository.findOne({ where: { id } })

  if (isNull(game)) {
    throw createError({
      statusCode: 404,
      data: {
        errorKey: 'common.not-found'
      }
    })
  }

  if (game.createdById !== session.user.id) {
    throw createError({
      statusCode: 403,
      data: {
        errorKey: 'common.forbidden'
      }
    })
  }

  await gameRepository.remove(game)

  return {
    success: true,
    message: 'Game deleted successfully'
  }
})
