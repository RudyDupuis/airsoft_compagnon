import { seedGames } from './GameSeeder'
import { seedUsers } from './UserSeeder'

export async function runSeeders() {
  await seedUsers()
  await seedGames()
}
