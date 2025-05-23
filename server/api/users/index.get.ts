import { TypeORM } from '~/server/db/config'
import { User } from '~/server/db/entities/User'
import { getSessionAndUser } from '~/server/utils/userSession'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)

  const userRepository = TypeORM.getRepository(User)
  const users = await userRepository.find({
    order: {
      pseudo: 'ASC'
    }
  })

  if (user.isAdmin) {
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...userWithoutPassword } = user
      return userWithoutPassword
    })
  }

  return users
    .filter((user) => !user.isBanned)
    .map((user) => ({
      id: user.id,
      pseudo: user.pseudo,
      computedReputation: user.computedReputation,
      createdAt: user.createdAt,
      gamesPlayedCount: user.gamesPlayedCount
    }))
})
