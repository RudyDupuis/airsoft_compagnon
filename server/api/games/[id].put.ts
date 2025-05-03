import { Game, GameType, PrivacyType, ValidationType } from '~/server/db/entities/Game'
import { TypeORM } from '~/server/db/config'
import {
  isBlankString,
  isNotBlankString,
  isNull,
  isNullOrUndefined
} from '~/utils/types/typeGuards'
import { nameRegex } from '~/utils/validations/regex'
import { isInFuture, isPositiveNumber } from '~/utils/validations/methods'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (isNullOrUndefined(session) || isNullOrUndefined(session.user) || !session.user.isVerified) {
    throw createError({
      statusCode: 401,
      data: {
        errorKey: 'common.unauthorized'
      }
    })
  }

  const id = Number(event.context.params?.id)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.invalid-id'
      }
    })
  }

  const {
    name,
    description,
    startDateTime,
    endDateTime,
    gameType,
    latitude,
    longitude,
    address,
    allowedConsumables,
    price,
    validationType,
    hasAmenities,
    hasParking,
    hasEquipmentRental,
    privacyType,
    maxParticipants
  } = await readBody(event)

  if (
    isNullOrUndefined(name) ||
    isNullOrUndefined(description) ||
    isNullOrUndefined(startDateTime) ||
    isNullOrUndefined(endDateTime) ||
    isNullOrUndefined(gameType) ||
    isNullOrUndefined(latitude) ||
    isNullOrUndefined(longitude) ||
    isNullOrUndefined(address) ||
    isNullOrUndefined(allowedConsumables) ||
    isNullOrUndefined(price) ||
    isNullOrUndefined(validationType) ||
    isNullOrUndefined(hasAmenities) ||
    isNullOrUndefined(hasParking) ||
    isNullOrUndefined(hasEquipmentRental) ||
    isNullOrUndefined(privacyType) ||
    isNullOrUndefined(maxParticipants)
  ) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.all-fields-required'
      }
    })
  }

  if (
    (isNotBlankString(name) && !nameRegex.test(name)) ||
    (isNotBlankString(startDateTime) && !isInFuture(startDateTime)) ||
    (isNotBlankString(endDateTime) && !isInFuture(endDateTime)) ||
    !Object.values(GameType).includes(gameType) ||
    isNaN(latitude) ||
    isNaN(longitude) ||
    isBlankString(address) ||
    !isPositiveNumber(price) ||
    !Object.values(ValidationType).includes(validationType) ||
    typeof hasAmenities !== 'boolean' ||
    typeof hasParking !== 'boolean' ||
    typeof hasEquipmentRental !== 'boolean' ||
    !Object.values(PrivacyType).includes(privacyType) ||
    !isPositiveNumber(maxParticipants)
  ) {
    throw createError({
      statusCode: 400,
      data: {
        errorKey: 'common.rules-not-respected'
      }
    })
  }

  const gameRepository = TypeORM.getRepository(Game)

  const game = await gameRepository.findOne({ where: { id } })

  if (isNull(game)) {
    throw createError({
      statusCode: 404,
      data: {
        errorKey: 'common.not-found'
      }
    })
  }

  if (game.createdById !== session.user.id) {
    throw createError({
      statusCode: 403,
      data: {
        errorKey: 'common.forbidden'
      }
    })
  }

  Object.assign(game, {
    name,
    description,
    startDateTime,
    endDateTime,
    gameType,
    latitude,
    longitude,
    address,
    allowedConsumables,
    price,
    validationType,
    hasAmenities,
    hasParking,
    hasEquipmentRental,
    privacyType,
    maxParticipants
  })

  await gameRepository.save(game)

  return game
})
