import { TypeORM } from '~/server/db/config'
import { Rating } from '~/server/db/entities/Rating'
import { isNotNull } from '~/utils/types/typeGuards'
import { isNumberBetween0And5 } from '~/utils/validations/methods'
import { getSessionAndUser } from '~/server/utils/userSession'
import {
  throwIfIdIsNaN,
  throwIfObjectIsNotFound,
  validateFieldRules,
  validateRequiredFields
} from '~/server/utils/validation'
import { consoleError, errorResponse, successResponse } from '~/server/utils/response'
import { updateUserReputation } from '~/server/utils/updateUserReputation'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)

  const id = Number(event.context.params?.id)
  throwIfIdIsNaN(id, user.id, 'putRating')

  const body = await readBody(event)

  validateRequiredFields(body, ['rating'], user.id, 'putRating')
  validateFieldRules(
    body,
    {
      rating: {
        check: (value) => !isNaN(Number(value)) && isNumberBetween0And5(Number(value))
      }
    },
    user.id,
    'putRating'
  )

  const ratingRepository = TypeORM.getRepository(Rating)

  const pendingRating = await ratingRepository.findOne({
    relations: ['fromUser', 'toUser', 'game'],
    where: { id }
  })
  throwIfObjectIsNotFound(pendingRating, 'Rating', id, user.id, 'putRating')

  if (pendingRating.fromUser.id !== user.id) {
    consoleError(
      `User is not the one who should provide this rating, ID: ${pendingRating.id}`,
      user.id,
      'putRating'
    )
    throw errorResponse('common.errors.forbidden', 403)
  }

  if (isNotNull(pendingRating.rate)) {
    consoleError(`Rating is already set, ID: ${pendingRating.id}`, user.id, 'putRating')
    throw errorResponse('pages.rate-participant.errors.already-set')
  }

  pendingRating.rate = body.rating
  pendingRating.ratedAt = new Date()

  await ratingRepository.save(pendingRating)
  await updateUserReputation(pendingRating.toUser.id)

  return successResponse('Rating updated successfully')
})
