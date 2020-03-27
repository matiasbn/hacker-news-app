/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
import path from 'path'
import mockRequest from '../helpers/mock-request'
import mockResponse from '../helpers/mock-response'
import MongoClient from '../../src/config/db'
import TEST_ERROR_MESSAGES from '../common/error-messages'
import getTestConfig from '../helpers/get-test-options'
import Logger from '~/src/config/logger'
import fetchAndStore from '../../src/helpers/fetch-and-store'
// import { debugTest } from '../../src/config/debug'
import Stories from '../../src/models/stories'
import Deleted from '../../src/models/deleted'
import Controller from '../../src/controllers'
import { debugTest } from '../../src/config/debug'

(async () => {
  const testOptions = getTestConfig(path.basename(__filename))
  if (!testOptions) {
    Logger.error(TEST_ERROR_MESSAGES.NO_TEST_CONFIG_FOUND)
  }
  // Start MongoClient without starting Express app
  await new MongoClient(testOptions).getInstance()
})()

// Set the funded account to be stored

describe('hacker-news-app unit testing', () => {
  beforeEach(async () => {
    await Stories.deleteMany({})
    await Deleted.deleteMany({})
  })

  test('fetch-and-store helper', async () => {
    const storedData = await fetchAndStore()
    const storedPromises = []
    storedData.forEach((data) => {
      const { story_id } = data
      storedPromises.push(Stories.findOne({ story_id }))
    })
    const stored = await Promise.all(storedPromises)
    debugTest(storedData[1])
    debugTest(stored[1])
    // If there is some missing, missingone would be true
    const missingOne = stored.some((hit) => hit === null)
    expect(!missingOne).toBe(true)
  })

  test('fetch controller', async () => {
    // Populate the Stories database
    await fetchAndStore()
    // Using jest functions mock
    const req = mockRequest({ body: { } })
    const res = mockResponse()
    await Controller.fetch(req, res)
    // Get only the story_id
    const firstResponse = res.success.mock.calls[0][0].map((story) => story.story_id)
    // Insert one story_id into Deleted collection
    const deleted = firstResponse[0]
    await Deleted.create({ story_id: deleted })
    // Call the controller again
    await Controller.fetch(req, res)
    const secondResponse = res.success.mock.calls[1][0].map((story) => story.story_id)
    // Check if the id was returned from controller, expecting stillOnDatabase to be false
    const stillOnDatabase = secondResponse.some((story) => story === deleted)
    expect(stillOnDatabase).toBe(false)
  })

  test('delete controller', async () => {
    // Populate the Stories database
    const stored = await fetchAndStore()
    // Get only the story_id
    const firstResponse = stored.map((story) => story.story_id)
    // Insert one story_id into Deleted collection
    // Delete using the controller
    const deleted = firstResponse[0]
    let req = mockRequest({ body: { storyId: deleted } })
    const res = mockResponse()
    await Controller.del(req, res)
    // Call the fetch controller
    req = mockRequest({ body: {} })
    await Controller.fetch(req, res)
    const apiResponse = res.success.mock.calls[1][0].map((story) => story.story_id)
    // Check if the id was returned from controller, expecting stillOnDatabase to be false
    const stillOnDatabase = apiResponse.some((story) => story === deleted)
    expect(stillOnDatabase).toBe(false)
  })
})
