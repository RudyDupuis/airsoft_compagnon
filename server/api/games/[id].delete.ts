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

  const game = await gameRepository.findOne({
    relations: ['participants', 'createdBy'],
    where: { id }
  })
  throwIfObjectIsNotFound(game, 'Game', id, user.id, 'deleteGame')

  if (!user.isAdmin) {
    if (new Date(game.startDateTime) < new Date()) {
      consoleError(`Game is already in progress or finished, ID: ${game.id}`, user.id, 'deleteGame')
      throw errorResponse('pages.dashboard.games.errors.game-in-progress-or-finished')
    }

    if (game.participants.length > 0) {
      consoleError(`Game has participants, ID: ${game.id}`, user.id, 'deleteGame')
      throw errorResponse('pages.dashboard.games.errors.game-has-participants')
    }

    if (game.createdBy.id !== user.id) {
      consoleError(`User is not the creator of the game, ID: ${game.id}`, user.id, 'deleteGame')
      throw errorResponse('common.errors.forbidden', 403)
    }
  }

  await gameRepository.remove(game)

  return successResponse('Game deleted successfully')
})
