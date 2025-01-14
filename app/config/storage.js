import Joi from 'joi'

export const buildConfig = () => {
  const schema = Joi.object({
    connectionString: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
    storageAccount: Joi.string().required(),
    usersContainer: Joi.string(),
    documentContainer: Joi.string(),
    useConnectionString: Joi.boolean(),
    createContainers: Joi.boolean()
  })

  const config = {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    usersContainer: process.env.AZURE_STORAGE_USERS_CONTAINER || 'users',
    documentContainer: process.env.AZURE_STORAGE_DOCUMENT_CONTAINER || 'documents',
    useConnectionString: process.env.AZURE_STORAGE_USE_CONNECTION_STRING === 'true',
    createContainers: process.env.AZURE_STORAGE_CREATE_CONTAINERS === 'true'
  }

  const { error } = schema.validate(config, {
    abortEarly: false
  })

  if (error) {
    throw new Error(`The blob storage config is invalid. ${error.message}`)
  }

  return config
}

export const storageConfig = buildConfig()
