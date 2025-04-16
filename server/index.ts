import express from 'express'
import initDatabase from './db/config'

const app = express()
app.use(express.json())

initDatabase()

export default fromNodeMiddleware(app)
