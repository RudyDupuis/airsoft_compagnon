import { User } from '~/server/db/entities/User'
import { Rating } from '~/server/db/entities/Rating'
import { TypeORM } from '../db/config'
import { IsNull, Not } from 'typeorm'
import { isNull } from '~/utils/types/typeGuards'

export async function updateUserReputation(userId: number) {
  const ratingRepository = TypeORM.getRepository(Rating)
  const userRepository = TypeORM.getRepository(User)

  const latestRatings = await ratingRepository.find({
    where: { toUser: { id: userId }, rate: Not(IsNull()) }
  })

  if (latestRatings.length === 0) {
    await userRepository.update(userId, { computedReputation: null })
    return
  }

  const ratingsSum = latestRatings.reduce((acc, rating) => {
    if (isNull(rating.rate)) {
      return acc
    }
    return acc + Number(rating.rate)
  }, 0)

  const newReputation = Math.round((ratingsSum / latestRatings.length) * 10) / 10

  await userRepository.update(userId, { computedReputation: newReputation })
}
