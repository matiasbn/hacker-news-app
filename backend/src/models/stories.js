import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const StorySchema = new Schema({
  created_at_i: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
  },
  title: {
    type: String,
  },
  story_id: {
    type: Number,
    required: true,
    unique: true,
  },
  story_title: {
    type: String,
    required: true,
  },
  story_url: {
    type: String,
    required: true,
  },
}, {
  autoIndex: true,
  timestamps: true,
})

StorySchema.plugin(uniqueValidator)
export default mongoose.model('Stories', StorySchema, 'stories')
