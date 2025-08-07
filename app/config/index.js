import Joi from 'joi'
import { dbConfig } from './db.js'
import { messageQueueConfig } from './message-queue.js'
import { storageConfig } from './storage.js'
const DEFAULT_APP_PORT = 3005
const buildConfig = () => {
  const schema = Joi.object({
    port: Joi.number(),
    env: Joi.string().valid('development', 'test', 'production'),
    isDev: Joi.boolean(),
    termsAndConditionsUrl: Joi.string(),
    applyServiceUri: Joi.string(),
    claimServiceUri: Joi.string(),
    sfdRequestMsgType: Joi.string(),
    carbonCopyEmailAddress: Joi.string().email().allow(null, ''),
    templateIdFarmerApplicationGenerationNewUser: Joi.string().uuid(),
    templateIdFarmerApplicationGenerationExistingUser: Joi.string().uuid()
  })

  const config = {
    port: process.env.PORT || DEFAULT_APP_PORT,
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV === 'development',
    termsAndConditionsUrl: process.env.TERMS_AND_CONDITIONS_URL || '#',
    applyServiceUri: process.env.APPLY_SERVICE_URI || '#',
    claimServiceUri: process.env.CLAIM_SERVICE_URI || '#',
    sfdRequestMsgType: 'uk.gov.ffc.ahwr.sfd.request',
    carbonCopyEmailAddress: process.env.CARBON_COPY_EMAIL_ADDRESS,
    templateIdFarmerApplicationGenerationNewUser: process.env.NOTIFY_TEMPLATE_ID_FARMER_APPLICATION_COMPLETE_NEW_USER,
    templateIdFarmerApplicationGenerationExistingUser: process.env.NOTIFY_TEMPLATE_ID_FARMER_APPLICATION_COMPLETE_EXISTING_USER
  }

  const { error } = schema.validate(config, { abortEarly: false })

  if (error) {
    throw new Error(`The application config is invalid. ${error.message}`)
  }

  return {
    ...config,
    dbConfig,
    messageQueueConfig,
    storageConfig
  }
}

export const appConfig = buildConfig()
