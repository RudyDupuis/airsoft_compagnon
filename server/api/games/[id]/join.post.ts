import { Game } from '~/server/db/entities/Game'
import { TypeORM } from '~/server/db/config'
import { getSessionAndUser } from '~/server/utils/userSession'
import { consoleError, errorResponse, successResponse } from '~/server/utils/response'
import { throwIfIdIsNaN, throwIfObjectIsNotFound } from '~/server/utils/validation'
import { isNotNull, isNull } from '~/utils/types/typeGuards'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)

  const id = Number(event.context.params?.id)
  throwIfIdIsNaN(id, user.id, 'joinGame')

  const gameRepository = TypeORM.getRepository(Game)

  const game = await gameRepository.findOne({
    where: { id },
    relations: ['participants']
  })
  throwIfObjectIsNotFound(game, 'Game', id, user.id, 'joinGame')

  if (isNull(user.computedReputation) && !game.allowedNotRated) {
    throw errorResponse('pages.dashboard.games.errors.not-rated-not-allowed')
  }

  if (isNotNull(user.computedReputation) && game.minimalReputation > user.computedReputation) {
    throw errorResponse('pages.dashboard.games.errors.not-enough-reputation')
  }

  if (new Date(game.startDateTime) < new Date()) {
    consoleError(`Game is already in progress or finished, ID: ${game.id}`, user.id, 'joinGame')
    throw errorResponse('pages.dashboard.games.errors.game-in-progress-or-finished')
  }

  if (game.participants.some((participant) => participant.id === user.id)) {
    consoleError(`User is already a participant in game ${game.id}`, user.id, 'joinGame')
    throw errorResponse('pages.dashboard.games.errors.user-already-joined')
  }

  if (game.participants.length >= game.maxParticipants) {
    consoleError(`Game is full, ID: ${game.id}`, user.id, 'joinGame')
    throw errorResponse('pages.dashboard.games.errors.game-full')
  }

  if (game.privacyType === 'private') {
    // TODO: Check if the user is invited
    throw errorResponse('pages.dashboard.games.errors.private-game')
  }

  game.participants.push(user)
  await gameRepository.save(game)

  return successResponse('Successfully joined the game')
})
