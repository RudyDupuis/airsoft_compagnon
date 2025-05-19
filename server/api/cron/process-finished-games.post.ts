import { User } from '~/server/db/entities/User'
import { TypeORM } from '../../db/config'
import { Game } from '../../db/entities/Game'
import { LessThan } from 'typeorm'
import { isNull, isUndefined } from '~/utils/types/typeGuards'
import { Rating } from '~/server/db/entities/Rating'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  if (isUndefined(query.key) || query.key !== process.env.CRON_API_KEY) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const gameRepository = TypeORM.getRepository(Game)
  const userRepository = TypeORM.getRepository(User)
  const ratingRepository = TypeORM.getRepository(Rating)

  const games = await gameRepository.find({
    where: {
      endDateTime: LessThan(new Date()),
      hasGeneratedRatings: false
    },
    relations: ['participants']
  })

  const processedGameIds: number[] = []
  const createdRatingIds: number[] = []

  for (const game of games) {
    for (const fromUser of game.participants) {
      await userRepository.increment({ id: fromUser.id }, 'gamesPlayedCount', 1)

      for (const toUser of game.participants) {
        if (fromUser.id === toUser.id) {
          continue
        }

        const existingRating = await ratingRepository.findOne({
          where: {
            game: { id: game.id },
            fromUser: { id: fromUser.id },
            toUser: { id: toUser.id }
          }
        })

        if (isNull(existingRating)) {
          const rating = ratingRepository.create({
            game,
            fromUser,
            toUser,
            rate: null,
            ratedAt: null,
            createdAt: new Date()
          })
          const savedRating = await ratingRepository.save(rating)
          createdRatingIds.push(savedRating.id)
        }
      }
    }

    game.hasGeneratedRatings = true
    await gameRepository.save(game)
    processedGameIds.push(game.id)
  }

  return `🏅  Processed games with IDs: [${processedGameIds.join(', ')}]; Created ratings with IDs: [${createdRatingIds.join(', ')}]`
})
