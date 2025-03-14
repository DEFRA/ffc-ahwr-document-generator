import { setup } from './insights.js'
import { startMessaging, stopMessaging } from './messaging/index.js'
import { createServer } from './server.js'
import { closeAllConnections } from './messaging/create-message-sender.js'

const init = async () => {
  const server = await createServer()
  await startMessaging(server.logger)

  await server.start()
  server.logger.info(`Server running on ${server.info.uri}`)
  setup(server.logger)
}

process.on('SIGTERM', async () => {
  await stopMessaging()
  await closeAllConnections()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stopMessaging()
  await closeAllConnections()
  process.exit(0)
})

init()
