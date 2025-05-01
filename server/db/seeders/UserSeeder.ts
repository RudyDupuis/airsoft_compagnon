import { TypeORM } from '../config'
import { User } from '../entities/User'

export const userSeeds = [
  {
    email: 'john.doe@example.com',
    password: 'password123!',
    dateOfBirth: new Date('1990-01-01'),
    firstName: 'John',
    lastName: 'Doe',
    pseudo: 'Johnny',
    isVerified: true
  },
  {
    email: 'jane.doe@example.com',
    password: 'password123!',
    dateOfBirth: new Date('1992-02-02'),
    firstName: 'Jane',
    lastName: 'Doe',
    pseudo: 'Jane_d',
    isVerified: false
  },
  {
    email: 'alice.smith@example.com',
    password: 'password123!',
    dateOfBirth: new Date('1985-05-05'),
    firstName: 'Alice',
    lastName: 'Smith',
    pseudo: 'Alice85',
    isVerified: true
  }
]

export async function seedUsers() {
  const userRepository = TypeORM.getRepository(User)

  await Promise.all(
    userSeeds.map(async (seed) => {
      const passwordHash = await hashPassword(seed.password)
      const user = userRepository.create({
        email: seed.email,
        passwordHash,
        dateOfBirth: seed.dateOfBirth,
        firstName: seed.firstName,
        lastName: seed.lastName,
        pseudo: seed.pseudo,
        isVerified: seed.isVerified
      })
      return userRepository.save(user)
    })
  )
}
