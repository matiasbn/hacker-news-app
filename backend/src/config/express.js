import express from 'express'
import consola from 'consola'
import errorHandlerMiddleware from '@feathersjs/errors/handler'
import notFoundMiddleware from '@feathersjs/errors/not-found'
import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import methodOverride from 'method-override'
import morgan from 'morgan'
import routes from '../routes'


const app = express()
app.set('trust proxy', true)
app.use(cors({
  origin: 'http://localhost:3000',
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression({ level: 8 }))
app.use(helmet())
app.use(methodOverride())

// app.use(morgan('dev'))
app.use(morgan('dev', {
  skip() {
    return process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production'
  },
}))

// Routes
app.use('/', routes)

app.use((request, response, next) => {
  delete request.headers.accept
  next()
})

// Error handlers
app.use(errorHandlerMiddleware({ logger: consola }))
app.use(notFoundMiddleware())

export default app
