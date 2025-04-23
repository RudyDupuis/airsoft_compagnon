import { TypeORM } from '../config'
import { seedUsers } from './UserSeeder'

export async function runSeeders() {
  TypeORM.entityMetadatas.forEach(async (entity) => {
    await TypeORM.getRepository(entity.name).clear()
  })

  await seedUsers()
}
