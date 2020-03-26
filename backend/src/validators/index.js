/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator'

const checkBody = [
  body('storyId').exists().withMessage('storyId field is necessary').bail(),
]

const checkFormat = [
  body('storyId').isDecimal().withMessage('storyId is not a number'),
]


export default {
  checkBody,
  checkFormat,
}
