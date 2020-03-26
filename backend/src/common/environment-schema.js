import Joi from '@hapi/joi'

const environmentSchema = (environment) => {
  const joiString = Joi.string()
  const joiNumber = Joi.number()
  return {
    NODE_ENV: joiString.required().valid('development', 'production', 'test').default('development'),
    MONGO_URI: joiString.required(),
    APP_PORT: joiNumber.required(),
    ...environment === 'main' && { DATABASE_NAME: joiString.required() },
  }
}

export default environmentSchema
