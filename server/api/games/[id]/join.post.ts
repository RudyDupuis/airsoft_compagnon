import { Game } from '~/server/db/entities/Game'
import { User } from '~/server/db/entities/User'
import { TypeORM } from '~/server/db/config'
import { isNull, isNullOrUndefined } from '~/utils/types/typeGuards'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (isNullOrUndefined(session) || isNullOrUndefined(session.user)) {
    throw createError({
      statusCode: 401,
      data: {
        errorKey: 'common.errors.unauthorized'
      }
    })
  }

  const gameId = Number(event.context.params?.id)

  if (isNaN(gameId)) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.errors.invalid-id'
      }
    })
  }

  const gameRepository = TypeORM.getRepository(Game)
  const userRepository = TypeORM.getRepository(User)

  const game = await gameRepository.findOne({
    where: { id: gameId },
    relations: ['participants']
  })

  if (isNull(game)) {
    throw createError({
      statusCode: 404,
      data: {
        errorKey: 'common.errors.not-found'
      }
    })
  }

  const user = await userRepository.findOne({
    where: { id: session.user.id }
  })

  if (isNull(user)) {
    throw createError({
      statusCode: 404,
      data: {
        errorKey: 'common.errors.user-not-found'
      }
    })
  }

  const isAlreadyParticipant = game.participants.some((participant) => participant.id === user.id)
  if (isAlreadyParticipant) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'pages.dashboard.game.errors.user-already-joined'
      }
    })
  }

  if (game.participants.length >= game.maxParticipants) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'pages.dashboard.game.errors.game-full'
      }
    })
  }

  if (game.privacyType === 'private') {
    // TODO: Check if the user is invited
    throw createError({
      statusCode: 403,
      data: {
        errorKey: 'pages.dashboard.game.errors.private-game'
      }
    })
  }

  game.participants.push(user)
  await gameRepository.save(game)

  return {
    success: true,
    message: 'Successfully joined the game'
  }
})
