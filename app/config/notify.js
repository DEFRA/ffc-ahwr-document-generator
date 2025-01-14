import Joi from 'joi'

const buildConfig = () => {
  const uuidRegex = '[0-9a-f]{8}\\b-[0-9a-f]{4}\\b-[0-9a-f]{4}\\b-[0-9a-f]{4}\\b-[0-9a-f]{12}'
  const notifyApiKeyRegex = new RegExp(`.*-${uuidRegex}-${uuidRegex}`)

  const schema = Joi.object({
    carbonCopyEmailAddress: Joi.string().email().allow(null, ''),
    notifyApiKey: Joi.string().pattern(notifyApiKeyRegex),
    notifyCheckInterval: Joi.number(),
    templateIdFarmerApplicationGeneration: Joi.string().uuid(),
    templateIdFarmerApplicationGenerationNewUser: Joi.string().uuid(),
    templateIdFarmerApplicationGenerationExistingUser: Joi.string().uuid()
  })

  const config = {
    carbonCopyEmailAddress: process.env.CARBON_COPY_EMAIL_ADDRESS,
    notifyApiKey: process.env.NOTIFY_API_KEY,
    notifyCheckInterval: process.env.NOTIFY_CHECK_INTERVAL || 30000,
    templateIdFarmerApplicationGeneration: process.env.NOTIFY_TEMPLATE_ID_FARMER_APPLICATION_COMPLETE,
    templateIdFarmerApplicationGenerationNewUser: process.env.NOTIFY_TEMPLATE_ID_FARMER_APPLICATION_COMPLETE_NEW_USER,
    templateIdFarmerApplicationGenerationExistingUser: process.env.NOTIFY_TEMPLATE_ID_FARMER_APPLICATION_COMPLETE_EXISTING_USER
  }

  const { error } = schema.validate(config, { abortEarly: false })

  if (error) {
    throw new Error(`The notify config is invalid. ${error.message}`)
  }

  return config
}

export const notifyConfig = buildConfig()
