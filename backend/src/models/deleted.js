import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const DeletedSchema = new Schema({
  story_id: {
    type: Number,
    required: true,
    unique: true,
  },
}, {
  autoIndex: true,
  timestamps: true,
})

DeletedSchema.plugin(uniqueValidator)
export default mongoose.model('Deleted', DeletedSchema)
