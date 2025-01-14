import Joi from 'joi'
import { dbConfig } from './db.js'
import { messageQueueConfig } from './message-queue.js'
import { notifyConfig } from './notify.js'
import { storageConfig } from './storage.js'

const buildConfig = () => {
  const schema = Joi.object({
    port: Joi.number(),
    env: Joi.string().valid('development', 'test', 'production'),
    isDev: Joi.boolean(),
    termsAndConditionsUrl: Joi.string(),
    applyServiceUri: Joi.string(),
    claimServiceUri: Joi.string(),
    sfdRequestMsgType: Joi.string(),
    sfdMessage: {
      enabled: Joi.bool()
    }
  })

  const config = {
    port: process.env.PORT || 3005,
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV === 'development',
    termsAndConditionsUrl: process.env.TERMS_AND_CONDITIONS_URL || '#',
    applyServiceUri: process.env.APPLY_SERVICE_URI || '#',
    claimServiceUri: process.env.CLAIM_SERVICE_URI || '#',
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
