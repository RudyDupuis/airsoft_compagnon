import { getSessionAndUser } from '~/server/utils/userSession'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...userWithoutPassword } = user
  return userWithoutPassword
})
