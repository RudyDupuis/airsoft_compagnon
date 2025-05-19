import { getSessionAndUser } from '~/server/utils/userSession'
import { TypeORM } from '../db/config'
import { Rating } from '../db/entities/Rating'
import { IsNull } from 'typeorm'
import Notification from '~/utils/interface/Notification'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)

  const ratingRepository = TypeORM.getRepository(Rating)

  const pendingRatings = await ratingRepository.find({
    where: {
      fromUser: { id: user.id },
      rate: IsNull()
    },
    relations: ['game']
  })

  const seenGames = new Set<number>()
  const notifications: Notification[] = []
  for (const rating of pendingRatings) {
    if (!seenGames.has(rating.game.id)) {
      seenGames.add(rating.game.id)
      notifications.push({
        message: {
          key: 'components.header.notification.pending-rating.message',
          values: {
            gameName: rating.game.name
          }
        },
        link: {
          url: `/rate-participants`,
          linkTextKey: 'components.header.notification.pending-rating.link'
        }
      })
    }
  }

  return notifications
})
