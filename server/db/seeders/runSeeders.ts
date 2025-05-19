import { seedGames } from './GameSeeder'
import { seedRatings } from './RatingSeeder'
import { seedUsers } from './UserSeeder'

export async function runSeeders() {
  await seedUsers()
  await seedGames()
  await seedRatings()
}
