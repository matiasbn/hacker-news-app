import './config/env'
import cron from 'node-cron'
import MongoClient from './config/db'
import app from './config/express'
import Logger from './config/logger'
import { debugStart } from './config/debug'
import fetchAndStore from './helpers/fetch-and-store'


const start = async () => {
  try {
    await new MongoClient().getInstance(app)
    // Execute once the service is running
    await fetchAndStore()
    cron.schedule('* */1 * * *', async () => {
      debugStart('storing every 1 hour')
      // Execute every 1 hour
      await fetchAndStore()
    })
  } catch (error) {
    Logger.error(error)
  }
}

start()
