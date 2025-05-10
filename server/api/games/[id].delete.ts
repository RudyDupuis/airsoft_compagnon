import { Game } from '~/server/db/entities/Game'
import { TypeORM } from '~/server/db/config'
import { throwIfUserIsNotVerified, getSessionAndUser } from '~/server/utils/userSession'
import { throwIfIdIsNaN, throwIfObjectIsNotFound } from '~/server/utils/validation'
import { consoleError, errorResponse, successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)
  throwIfUserIsNotVerified(user)

  const id = Number(event.context.params?.id)
  throwIfIdIsNaN(id, user.id, 'deleteGame')

  const gameRepository = TypeORM.getRepository(Game)

  const game = await gameRepository.findOne({ where: { id } })
  throwIfObjectIsNotFound(game, 'Game', id, user.id, 'deleteGame')

  if (game.createdById !== user.id && !user.isAdmin) {
    consoleError(`User is not the creator of the game, ID: ${game.id}`, user.id, 'deleteGame')
    throw errorResponse('common.errors.forbidden', 403)
  }

  await gameRepository.remove(game)

  return successResponse('Game deleted successfully')
})
