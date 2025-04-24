import { TypeORM } from '../config'
import { Game } from '../entities/Game'

export const gameSeeds = [
  {
    name: 'Game 1',
    description: 'Description for Game 1',
    date: new Date('2023-01-01'),
    paf: 10
  },
  {
    name: 'Game 2',
    description: 'Description for Game 2',
    date: new Date('2023-02-02'),
    paf: 20
  },
  {
    name: 'Game 3',
    description: 'Description for Game 3',
    date: new Date('2023-03-03'),
    paf: 30
  }
]

export async function seedGames() {
  const gameRepository = TypeORM.getRepository(Game)

  gameSeeds.forEach(async (seed) => {
    const game = gameRepository.create({
      name: seed.name,
      description: seed.description,
      date: seed.date,
      paf: seed.paf
    })
    await gameRepository.save(game)
  })
}
