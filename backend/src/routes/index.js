import { Router } from 'express'
import responder from 'express-api-responder'
import trimRequest from 'trim-request'
import Controller from '../controllers'
import validation from '../validators'
import validator from '../middlewares/validator'

const router = new Router()

router
  .use(responder({ includeCode: 'status', includeSuccess: 'success' }))
  .use(trimRequest.all)

router.get('/', (request, response) => response.success({ message: 'Hacker news API is alive!', uptime: process.uptime() }))

router
  .get('/fetch', Controller.fetch)

router
  .post('/delete',
    validation.checkFormat,
    validation.checkBody,
    validator,
    Controller.del)

router
  .get('/recover',
    Controller.recover)

router
  .get('/populate',
    Controller.populate)

export default router
