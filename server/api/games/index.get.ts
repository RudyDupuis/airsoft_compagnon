import { Game } from '~/server/db/entities/Game'
import { TypeORM } from '~/server/db/config'
import { MoreThan } from 'typeorm'

export default defineEventHandler(async (event) => {
  const { notInProgressOrFinished, filteredForUser } = getQuery(event)

  let where

  if (notInProgressOrFinished === 'true') {
    where = {
      startDateTime: MoreThan(new Date())
    }
  }

  if (filteredForUser === 'true') {
    const { user } = await getSessionAndUser(event)

    where = [
      {
        startDateTime: MoreThan(new Date())
      },
      {
        participants: {
          id: user.id
        }
      },
      {
        createdBy: user
      }
    ]

    if (user.isAdmin) {
      where = undefined
    }
  }

  const gameRepository = TypeORM.getRepository(Game)
  const games = await gameRepository.find({
    relations: ['participants', 'createdBy'],
    where,
    select: {
      participants: {
        id: true,
        pseudo: true,
        computedReputation: true,
        createdAt: true,
        gamesPlayedCount: true
      },
      createdBy: {
        id: true,
        pseudo: true,
        computedReputation: true,
        createdAt: true,
        gamesPlayedCount: true
      }
    }
  })

  return games
})
