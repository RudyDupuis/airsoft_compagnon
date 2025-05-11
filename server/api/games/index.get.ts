import { Game } from '~/server/db/entities/Game'
import { TypeORM } from '~/server/db/config'
import { MoreThan } from 'typeorm'

export default defineEventHandler(async (event) => {
  const { notInProgressOrFinished } = getQuery(event)

  const gameRepository = TypeORM.getRepository(Game)
  const games = await gameRepository.find({
    relations: ['participants'],
    where:
      notInProgressOrFinished === 'true'
        ? {
            startDateTime: MoreThan(new Date())
          }
        : {}
  })

  return games
})
