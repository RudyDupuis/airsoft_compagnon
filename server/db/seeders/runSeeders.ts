import { TypeORM } from '../config'
import { seedGames } from './GameSeeder'
import { seedUsers } from './UserSeeder'

export async function runSeeders() {
  TypeORM.entityMetadatas.forEach(async (entity) => {
    await TypeORM.getRepository(entity.name).clear()
  })

  await seedUsers()
  await seedGames()
}
