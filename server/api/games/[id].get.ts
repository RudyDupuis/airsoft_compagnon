import { Game } from '~/server/db/entities/Game'
import { TypeORM } from '~/server/db/config'
import { isNotNull } from '~/utils/types/typeGuards'

export default defineEventHandler(async (event) => {
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
  const game = await gameRepository.findOne({
    where: { id },
    relations: ['participants']
  })

  if (!isNotNull(game)) {
    throw createError({
      statusCode: 404,
      data: {
        errorKey: 'games.not-found'
      }
    })
  }

  return game
})
