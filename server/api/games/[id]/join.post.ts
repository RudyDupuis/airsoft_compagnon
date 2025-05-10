import { Game } from '~/server/db/entities/Game'
import { TypeORM } from '~/server/db/config'
import { getSessionAndUser } from '~/server/utils/userSession'
import { errorResponse, successResponse } from '~/server/utils/response'
import { throwIfIdIsNaN, throwIfObjectIsNotFound } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)

  const id = Number(event.context.params?.id)
  throwIfIdIsNaN(id)

  const gameRepository = TypeORM.getRepository(Game)

  const game = await gameRepository.findOne({
    where: { id },
    relations: ['participants']
  })
  throwIfObjectIsNotFound(game)

  const isAlreadyParticipant = game.participants.some((participant) => participant.id === user.id)
  if (isAlreadyParticipant) {
    throw errorResponse('pages.dashboard.games.errors.user-already-joined')
  }

  if (game.participants.length >= game.maxParticipants) {
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
