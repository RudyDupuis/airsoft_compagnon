import { User } from '~/server/db/entities/User'
import { TypeORM } from '~/server/db/config'
import { throwIfUserIsNotAdmin, getSessionAndUser } from '~/server/utils/userSession'
import { successResponse } from '~/server/utils/response'
import { throwIfIdIsNaN } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const { user: admin } = await getSessionAndUser(event)
  throwIfUserIsNotAdmin(admin)

  const id = Number(event.context.params?.id)
  throwIfIdIsNaN(id)

  const userRepository = TypeORM.getRepository(User)

  const user = await userRepository.findOne({
    where: { id }
  })
  throwIfObjectIsNotFound(user)

  user.isBanned = !user.isBanned

  await userRepository.save(user)

  return successResponse('User verification status updated')
})
