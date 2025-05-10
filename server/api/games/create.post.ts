import { Game, GameType, PrivacyType, ValidationType } from '~/server/db/entities/Game'
import { TypeORM } from '~/server/db/config'
import { isNotBlankString, isString } from '~/utils/types/typeGuards'
import { nameRegex } from '~/utils/validations/regex'
import { isInFuture, isPositiveNumber } from '~/utils/validations/methods'
import { throwIfUserIsNotVerified, getSessionAndUser } from '~/server/utils/userSession'
import { validateFieldRules, validateRequiredFields } from '~/server/utils/validation'
import { successResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const { user } = await getSessionAndUser(event)
  throwIfUserIsNotVerified(user)

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
      'validationType',
      'hasAmenities',
      'hasParking',
      'hasEquipmentRental',
      'privacyType',
      'maxParticipants'
    ],
    user.id,
    'postGame'
  )
  validateFieldRules(
    body,
    {
      name: {
        check: (value) => isString(value) && isNotBlankString(value) && nameRegex.test(value)
      },
      startDateTime: {
        check: (value) => isString(value) && isNotBlankString(value) && isInFuture(value)
      },
      endDateTime: {
        check: (value) => isString(value) && isNotBlankString(value) && isInFuture(value)
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
      validationType: {
        check: (value) =>
          isString(value) &&
          isNotBlankString(value) &&
          Object.values(ValidationType).includes(value as ValidationType)
      },
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
    'postGame'
  )

  const gameRepository = TypeORM.getRepository(Game)

  const game = gameRepository.create({
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
    validationType: body.validationType,
    hasAmenities: body.hasAmenities,
    hasParking: body.hasParking,
    hasEquipmentRental: body.hasEquipmentRental,
    privacyType: body.privacyType,
    maxParticipants: body.maxParticipants,
    createdAt: new Date(),
    createdById: user.id
  })

  await gameRepository.save(game)

  return successResponse('Game created successfully')
})
