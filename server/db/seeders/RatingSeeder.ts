import { isNull } from '~/utils/types/typeGuards'
import { TypeORM } from '../config'
import { Game } from '../entities/Game'
import { Rating } from '../entities/Rating'
import { User } from '../entities/User'

export const ratingSeeds = [
  {
    gameId: 9,
    fromUserId: 1,
    toUserId: 2,
    rating: 3,
    ratedAt: new Date('2017-05-01')
  },
  {
    gameId: 9,
    fromUserId: 1,
    toUserId: 4,
    rating: 5,
    ratedAt: new Date('2017-05-01')
  },
  {
    gameId: 9,
    fromUserId: 2,
    toUserId: 1,
    rating: 4,
    ratedAt: new Date('2017-05-01')
  },
  {
    gameId: 9,
    fromUserId: 2,
    toUserId: 4,
    rating: 5,
    ratedAt: new Date('2017-05-01')
  }
]

export async function seedRatings() {
  const ratingRepository = TypeORM.getRepository(Rating)
  const userRepository = TypeORM.getRepository(User)
  const gameRepository = TypeORM.getRepository(Game)

  for (const seed of ratingSeeds) {
    const fromUser = await userRepository.findOne({
      where: { id: seed.fromUserId }
    })
    if (isNull(fromUser)) {
      console.error(`User with ID ${seed.fromUserId} not found for game ${seed.gameId}`)
      continue
    }

    const toUser = await userRepository.findOne({
      where: { id: seed.toUserId }
    })
    if (isNull(toUser)) {
      console.error(`User with ID ${seed.toUserId} not found for game ${seed.gameId}`)
      continue
    }

    const game = await gameRepository.findOne({
      where: { id: seed.gameId }
    })
    if (isNull(game)) {
      console.error(`Game ID ${seed.gameId} not found`)
      continue
    }

    const rating = ratingRepository.create({
      game: game,
      fromUser: fromUser,
      toUser: toUser,
      rate: seed.rating,
      ratedAt: seed.ratedAt
    })

    await ratingRepository.save(rating)
  }
}
