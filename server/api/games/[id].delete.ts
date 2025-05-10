import { Game } from '~/server/db/entities/Game'
import { TypeORM } from '~/server/db/config'
import { throwIfUserIsNotVerified, getSessionAndUser } from '~/server/utils/userSession'
import { throwIfIdIsNaN, throwIfObjectIsNotFound } from '~/server/utils/validation'
import { errorResponse, successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)
  throwIfUserIsNotVerified(user)

  const id = Number(event.context.params?.id)
  throwIfIdIsNaN(id)

  const gameRepository = TypeORM.getRepository(Game)

  const game = await gameRepository.findOne({ where: { id } })
  throwIfObjectIsNotFound(game)

  if (game.createdById !== user.id && !user.isAdmin) {
    throw errorResponse('common.errors.forbidden', 403)
  }

  await gameRepository.remove(game)

  return successResponse('Game deleted successfully')
})
