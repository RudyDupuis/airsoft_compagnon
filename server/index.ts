import express from 'express'
import initDatabase from './db/config'
import 'reflect-metadata'

const app = express()
app.use(express.json())

initDatabase()

export default fromNodeMiddleware(app)
