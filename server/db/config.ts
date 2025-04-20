import { Sequelize } from 'sequelize-typescript'
import { isUndefined } from '~/utils/types/typeGuards'
import models from './modelRegistry'

if (
  isUndefined(process.env.DB_NAME) ||
  isUndefined(process.env.DB_USER) ||
  isUndefined(process.env.DB_PASSWORD)
) {
  throw new Error('Missing environment variables')
}

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  models: models,
  logging: process.env.DB_LOGGING === 'true'
})

export default async function initDatabase() {
  try {
    await sequelize.authenticate()
    console.log('Connection to database has been established successfully.')
    // TODO : remove force in production and make migrations
    await sequelize.sync({ force: true })
    console.log('Database synchronized successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
