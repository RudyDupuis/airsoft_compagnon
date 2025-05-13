import { TypeORM } from '../config'
import { User } from '../entities/User'

export const userSeeds = [
  {
    email: 'john.doe@example.com',
    password: 'Password123!',
    dateOfBirth: new Date('1990-01-01'),
    firstName: 'John',
    lastName: 'Doe',
    pseudo: 'Johnny',
    reputation: 4.5,
    isVerified: true,
    createdAt: new Date('2023-01-01'),
    gamesPlayed: 10
  },
  {
    email: 'jane.doe@example.com',
    password: 'Password123!',
    dateOfBirth: new Date('1992-02-02'),
    firstName: 'Jane',
    lastName: 'Doe',
    pseudo: 'Jane_d',
    reputation: 3.8,
    isVerified: false,
    createdAt: new Date('2024-02-01'),
    gamesPlayed: 5
  },
  {
    email: 'alice.smith@example.com',
    password: 'Password123!',
    dateOfBirth: new Date('1985-05-05'),
    firstName: 'Alice',
    lastName: 'Smith',
    pseudo: 'Alice85',
    isVerified: true,
    createdAt: new Date('2025-01-01'),
    gamesPlayed: 20
  },
  {
    email: 'rudy.dupuis@airsoft-compagnon.com',
    password: 'Password123!',
    dateOfBirth: new Date('2000-01-08'),
    firstName: 'Rudy',
    lastName: 'Dupuis',
    pseudo: 'Rudaye',
    isVerified: true,
    isAdmin: true,
    createdAt: new Date()
  },
  {
    email: 'badplayer@ban.com',
    password: 'Password123!',
    dateOfBirth: new Date('2002-05-18'),
    firstName: 'Bad',
    lastName: 'Player',
    pseudo: 'BadPlayer',
    createdAt: new Date(),
    isBanned: true
  }
]

export async function seedUsers() {
  const userRepository = TypeORM.getRepository(User)

  for (const seed of userSeeds) {
    const passwordHash = await hashPassword(seed.password)

    const user = userRepository.create({
      email: seed.email,
      passwordHash,
      dateOfBirth: seed.dateOfBirth,
      firstName: seed.firstName,
      lastName: seed.lastName,
      pseudo: seed.pseudo,
      reputation: seed.reputation,
      isVerified: seed.isVerified,
      isAdmin: seed.isAdmin,
      isBanned: seed.isBanned,
      createdAt: seed.createdAt,
      gamesPlayed: seed.gamesPlayed
    })

    await userRepository.save(user)
  }
}
