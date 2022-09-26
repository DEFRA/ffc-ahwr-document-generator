const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  connectionString: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  usersContainer: Joi.string().default('users'),
  usersFile: Joi.string().default('users.json'),
  documentContainer: Joi.string().default('documents'),
  useConnectionString: Joi.boolean().default(false),
  createContainers: Joi.boolean().default(true)
})

// Build config
const config = {
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  usersContainer: process.env.AZURE_STORAGE_USERS_CONTAINER,
  documentContainer: process.env.AZURE_STORAGE_DOCUMENT_CONTAINER,
  useConnectionString: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  createContainers: process.env.AZURE_STORAGE_CREATE_CONTAINERS
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
