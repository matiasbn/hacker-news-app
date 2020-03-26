/* eslint-disable max-len */
import { debugControllers } from '../config/debug'
import Logger from '../config/logger'
import Deleted from '../models/deleted'
import Stories from '../models/stories'

const fetch = async (request, response) => {
  try {
    let deleted = await Deleted.find({}, { _id: 0, story_id: 1 }).lean()
    deleted = deleted.map((del) => del.story_id)
    debugControllers('deleted: \n', deleted)
    // Fetch not deleted stories
    const stories = await Stories.find({ story_id: { $nin: deleted } })
    // Sort by created_at_i
    stories.sort((a, b) => b.created_at_i - a.created_at_i)
    debugControllers('stories: \n', stories)
    response.success(stories)
    // response.success(true)
  } catch (error) {
    Logger.error(error)
    response.error(error, 500)
  }
}

const del = async (request, response) => {
  try {
    const { storyId } = request.body
    debugControllers('storyId', storyId)
    const deleted = { story_id: storyId }
    await Deleted.updateOne(deleted, deleted, { upsert: true })
    response.success({ deleted: storyId })
  } catch (error) {
    Logger.error(error)
    response.error(error, 500)
  }
}

export default {
  fetch,
  del,
}
