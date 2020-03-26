/* eslint-disable consistent-return */
/* eslint-disable max-len */
import axios from 'axios'
import Stories from '../models/stories'
import Logger from '../config/logger'

const fetchAndStore = async () => {
  try {
    const response = await axios({ method: 'get', url: 'http://hn.algolia.com/api/v1/search_by_date?query=nodejs' })
    const { data } = response
    const formatted = data.hits.map((hit) => ({
      created_at_i: hit.created_at_i,
      title: hit.title,
      story_id: hit.story_id,
      story_title: hit.story_title,
      story_url: hit.story_url,
      url: hit.url,
    }))
    // Just hits with url or story_url
      .filter((hit) => hit.url || hit.story_url)
    // Remove repeated elements, checking per hit if it is the first element with the story_id
      .filter((hit, index, array) => array.findIndex((element) => (element.story_id === hit.story_id)) === index)
    // Insert many avoiding to store multiple times the same story_id using ordered:true
    await Stories.insertMany(formatted, { ordered: false })
    return formatted
  } catch (error) {
    Logger.error(error)
  }
}

export default fetchAndStore
