require('dotenv').config()

jest.mock('../app/config/notify', () => ({
  carbonCopyEmailAddress: undefined,
  notifyApiKey: 'mockNotifyApiKey',
  notfiyCheckInterval: 30000,
  templateIdFarmerApplicationGeneration: 'mockTemplateIdFarmerApplicationGeneration',
  templateIdFarmerApplicationGenerationNewUser: 'mockTemplateIdFarmerApplicationGenerationNewUser',
  templateIdFarmerApplicationGenerationExistingUser: 'mockTemplateIdFarmerApplicationGenerationExistingUser'
}))

jest.mock('../app/config/storage', () => ({
  storageAccount: 'mockStorageAccount'
}))

beforeEach(async () => {
  // Set reference to server in order to close the server during teardown.
  const { createServer } = require('../app/server')
  jest.setTimeout(15000)
  const server = await createServer()
  await server.initialize()
  global.__SERVER__ = server
})
