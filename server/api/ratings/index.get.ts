import { IsNull } from 'typeorm'
import { TypeORM } from '~/server/db/config'
import { Rating } from '~/server/db/entities/Rating'
import { getSessionAndUser } from '~/server/utils/userSession'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)

  const ratingRepository = TypeORM.getRepository(Rating)

  const pendingRatings = await ratingRepository.find({
    where: {
      fromUser: { id: user.id },
      rate: IsNull()
    },
    relations: ['game', 'toUser'],
    order: {
      game: {
        id: 'ASC'
      }
    }
  })

  return pendingRatings
})
