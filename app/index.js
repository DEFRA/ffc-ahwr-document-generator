import { setup } from './insights.js'
import { startMessaging, stopMessaging } from './messaging/index.js'
import { createServer } from './server.js'
import { closeAllConnections } from './messaging/create-message-sender.js'

const init = async () => {
  const appInsightsInUse = setup()
  const server = await createServer()
  await startMessaging(server.logger)

  await server.start()
  server.logger.info(`Server running on ${server.info.uri}`)
  server.logger.info(`App insights ${appInsightsInUse ? '' : 'not '}running`)
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
