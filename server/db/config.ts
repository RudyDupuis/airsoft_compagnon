import { DataSource } from 'typeorm'
import { isUndefined } from '~/utils/types/typeGuards'
import entities from './entitiesRegistry'

if (
  isUndefined(process.env.DB_NAME) ||
  isUndefined(process.env.DB_USER) ||
  isUndefined(process.env.DB_PASSWORD)
) {
  throw new Error('Missing environment variables')
}

//TODO: prepare migrations
export const TypeORM = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: process.env.ENV === 'Dev',
  entities: entities
})

export default async function initDatabase() {
  try {
    await TypeORM.initialize()
    console.log('Database connection established successfully')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
