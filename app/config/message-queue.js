import Joi from 'joi'

const buildConfig = () => {
  const sharedConfigSchema = {
    appInsights: Joi.object(),
    host: Joi.string(),
    password: Joi.string(),
    username: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    managedIdentityClientId: Joi.string().optional()
  }

  const schema = Joi.object({
    applicationdDocCreationRequestQueue: {
      address: Joi.string(),
      type: Joi.string(),
      ...sharedConfigSchema
    },
    sfdMessageQueue: {
      address: Joi.string(),
      type: Joi.string(),
      ...sharedConfigSchema
    }
  })

  const sharedConfig = {
    appInsights: require('applicationinsights'),
    host: process.env.MESSAGE_QUEUE_HOST,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    username: process.env.MESSAGE_QUEUE_USER,
    useCredentialChain: process.env.NODE_ENV === 'production',
    managedIdentityClientId: process.env.AZURE_CLIENT_ID
  }

  const config = {
    applicationdDocCreationRequestQueue: {
      address: process.env.APPLICATIONDOCCREATIONREQUEST_QUEUE_ADDRESS,
      type: 'queue',
      ...sharedConfig
    },
    sfdMessageQueue: {
      address: process.env.SFD_MESSAGE_QUEUE_ADDRESS,
      type: 'queue',
      ...sharedConfig
    }
  }

  const { error } = schema.validate(config, { abortEarly: false })

  if (error) {
    throw new Error(`The message queue config is invalid. ${error.message}`)
  }

  return config
}

export const messageQueueConfig = buildConfig()
