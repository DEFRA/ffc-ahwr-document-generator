import Joi from 'joi'
import { dbConfig } from './db'
import { messageQueueConfig } from './message-queue'
import { notifyConfig } from './notify'
import { storageConfig } from './storage'

const buildConfig = () => {
  const schema = Joi.object({
    port: Joi.number().default(3005),
    env: Joi.string().valid('development', 'test', 'production').default('development'),
    isDev: Joi.boolean().default(false),
    termsAndConditionsUrl: Joi.string().default('#'),
    applyServiceUri: Joi.string().default('#'),
    claimServiceUri: Joi.string().default('#'),
    sfdRequestMsgType: Joi.string(),
    sfdMessage: {
      enabled: Joi.bool().default(false)
    }
  })

  const config = {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    isDev: process.env.NODE_ENV === 'development',
    termsAndConditionsUrl: process.env.TERMS_AND_CONDITIONS_URL,
    applyServiceUri: process.env.APPLY_SERVICE_URI,
    claimServiceUri: process.env.CLAIM_SERVICE_URI,
    sfdRequestMsgType: 'uk.gov.ffc.ahwr.sfd.request',
    sfdMessage: {
      enabled: process.env.SFD_MESSAGE_ENABLED === 'true'
    }
  }

  const { error } = schema.validate(config, { abortEarly: false })

  if (error) {
    throw new Error(`The application config is invalid. ${error.message}`)
  }

  return {
    ...config,
    dbConfig,
    messageQueueConfig,
    notifyConfig,
    storageConfig
  }
}

export const appConfig = buildConfig()
