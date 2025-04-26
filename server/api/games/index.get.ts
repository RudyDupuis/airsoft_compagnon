import { Game } from '~/server/db/entities/Game'
import { TypeORM } from '~/server/db/config'

export default defineEventHandler(async () => {
  const gameRepository = TypeORM.getRepository(Game)
  const games = await gameRepository.find({
    relations: ['participants']
  })

  return games
})
