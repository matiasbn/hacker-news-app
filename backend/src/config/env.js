import appRootPath from 'app-root-path'
import dotenv from 'dotenv'
import Joi from '@hapi/joi'

const environmentSchema = (environment) => {
  const joiString = Joi.string()
  const joiNumber = Joi.number()
  return process.env.NODE_ENV !== 'production:docker'
    ? {
      NODE_ENV: joiString.required().valid('development', 'production', 'test').default('development'),
      MONGO_URI: joiString.required(),
      APP_PORT: joiNumber.required(),
      ...environment === 'main' && { DATABASE_NAME: joiString.required() },
    } : {}
}

dotenv.config({
  path: `${appRootPath.path}/.env`,
})

const environmentVarsSchema = Joi.object(environmentSchema('main'))
  .unknown()
  .required()

const { error } = environmentVarsSchema.validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default environmentSchema
