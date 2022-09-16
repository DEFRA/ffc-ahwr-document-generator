const Joi = require('joi')

const schema = Joi.object({
  notifyApiKey: Joi.string().required(),
  notfiyCheckInterval: Joi.number().default(30000),
  templateIdFarmerApplicationGeneration: Joi.string().required()
})

const config = {
  notifyApiKey: process.env.NOTIFY_API_KEY,
  notfiyCheckInterval: process.env.NOTIFY_CHECK_INTERVAL,
  templateIdFarmerApplicationGeneration: process.env.NOTIFY_TEMPLATE_ID_FARMER_APPLICATION_COMPLETE
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The notify config is invalid. ${error.message}`)
}

module.exports = value
