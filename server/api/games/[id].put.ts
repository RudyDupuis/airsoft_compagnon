import { Game, GameType, PrivacyType } from '~/server/db/entities/Game'
import { TypeORM } from '~/server/db/config'
import { isNotBlankString, isString } from '~/utils/types/typeGuards'
import { nameRegex } from '~/utils/validations/regex'
import { isInFuture, isNumberBetween0And5, isPositiveNumber } from '~/utils/validations/methods'
import { throwIfUserIsNotVerified, getSessionAndUser } from '~/server/utils/userSession'
import {
  throwIfIdIsNaN,
  throwIfObjectIsNotFound,
  validateFieldRules,
  validateRequiredFields
} from '~/server/utils/validation'
import { consoleError, errorResponse, successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)
  throwIfUserIsNotVerified(user)

  const id = Number(event.context.params?.id)
  throwIfIdIsNaN(id, user.id, 'putGame')

  const body = await readBody(event)

  validateRequiredFields(
    body,
    [
      'name',
      'description',
      'startDateTime',
      'endDateTime',
      'gameType',
      'latitude',
      'longitude',
      'address',
      'allowedConsumables',
      'price',
      'minimalReputation',
      'allowedNotRated',
      'hasAmenities',
      'hasParking',
      'hasEquipmentRental',
      'privacyType',
      'maxParticipants'
    ],
    user.id,
    'putGame'
  )
  validateFieldRules(
    body,
    {
      name: {
        check: (value) => isString(value) && isNotBlankString(value) && nameRegex.test(value)
      },
      startDateTime: {
        check: (value) =>
          (isString(value) && isNotBlankString(value) && isInFuture(value)) || user.isAdmin
      },
      endDateTime: {
        check: (value) =>
          (isString(value) && isNotBlankString(value) && isInFuture(value)) || user.isAdmin
      },
      gameType: {
        check: (value) =>
          isString(value) &&
          isNotBlankString(value) &&
          Object.values(GameType).includes(value as GameType)
      },
      latitude: { check: (value) => !isNaN(Number(value)) },
      longitude: { check: (value) => !isNaN(Number(value)) },
      address: { check: (value) => isString(value) && isNotBlankString(value) },
      price: { check: (value) => !isNaN(Number(value)) && isPositiveNumber(Number(value)) },
      minimalReputation: {
        check: (value) => !isNaN(Number(value)) && isNumberBetween0And5(Number(value))
      },
      allowedNotRated: { check: (value) => typeof value === 'boolean' },
      hasAmenities: { check: (value) => typeof value === 'boolean' },
      hasParking: { check: (value) => typeof value === 'boolean' },
      hasEquipmentRental: { check: (value) => typeof value === 'boolean' },
      privacyType: {
        check: (value) =>
          isString(value) &&
          isNotBlankString(value) &&
          Object.values(PrivacyType).includes(value as PrivacyType)
      },
      maxParticipants: {
        check: (value) => !isNaN(Number(value)) && isPositiveNumber(Number(value))
      }
    },
    user.id,
    'putGame'
  )

  const gameRepository = TypeORM.getRepository(Game)

  const game = await gameRepository.findOne({
    relations: ['participants', 'createdBy'],
    where: { id }
  })
  throwIfObjectIsNotFound(game, 'Game', id, user.id, 'putGame')

  if (!user.isAdmin) {
    if (new Date(game.startDateTime) < new Date()) {
      consoleError(`Game is already in progress or finished, ID: ${game.id}`, user.id, 'putGame')
      throw errorResponse('pages.dashboard.games.errors.game-in-progress-or-finished')
    }

    if (game.participants.length > 0) {
      consoleError(`Game has participants, ID: ${game.id}`, user.id, 'putGame')
      throw errorResponse('pages.dashboard.games.errors.game-has-participants')
    }

    if (game.createdBy.id !== user.id) {
      consoleError(`User is not the creator of the game, ID: ${game.id}`, user.id, 'putGame')
      throw errorResponse('common.errors.forbidden', 403)
    }
  }

  Object.assign(game, {
    name: body.name,
    description: body.description,
    startDateTime: body.startDateTime,
    endDateTime: body.endDateTime,
    gameType: body.gameType,
    latitude: body.latitude,
    longitude: body.longitude,
    address: body.address,
    allowedConsumables: body.allowedConsumables,
    price: body.price,
    minimalReputation: body.minimalReputation,
    allowedNotRated: body.allowedNotRated,
    hasAmenities: body.hasAmenities,
    hasParking: body.hasParking,
    hasEquipmentRental: body.hasEquipmentRental,
    privacyType: body.privacyType,
    maxParticipants: body.maxParticipants
  })

  await gameRepository.save(game)

  return successResponse('Game updated successfully')
})
