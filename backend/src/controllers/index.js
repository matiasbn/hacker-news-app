/* eslint-disable max-len */
// import { debugControllers } from '../config/debug'
import Logger from '../config/logger'
import Deleted from '../models/deleted'
import Stories from '../models/stories'

const fetch = async (request, response) => {
  try {
    let deleted = await Deleted.find({}, { _id: 0, story_id: 1 }).lean()
    deleted = deleted.map((del) => del.story_id)
    // fetch specific data
    const projection = {
      _id: 0,
      author: 1,
      created_at_i: 1,
      story_id: 1,
      story_title: 1,
      story_url: 1,
      title: 1,
    }
    // Fetch not deleted stories
    const stories = await Stories.find({ story_id: { $nin: deleted } }, projection)
    // Sort by created_at_i
    stories.sort((a, b) => b.created_at_i - a.created_at_i)
    response.success(stories)
  } catch (error) {
    Logger.error(error)
    response.error(error, 500)
  }
}

const del = async (request, response) => {
  try {
    const { storyId } = request.body
    const deleted = { story_id: storyId }
    await Deleted.updateOne(deleted, deleted, { upsert: true })
    response.success({ deleted: storyId })
  } catch (error) {
    Logger.error(error)
    response.error(error, 500)
  }
}

const recover = async (request, response) => {
  try {
    await Deleted.deleteMany({})
    response.success()
  } catch (error) {
    Logger.error(error)
    response.error(error, 500)
  }
}

export default {
  fetch,
  del,
  recover,
}
