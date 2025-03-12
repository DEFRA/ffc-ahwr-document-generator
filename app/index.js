import { setup } from './insights.js'
import { startMessaging, stopMessaging } from './messaging/index.js'
import { start as startNotifyMonitor } from './email/notify-monitor.js'
import { createServer } from './server.js'

const init = async () => {
  const server = await createServer()
  await startMessaging(server.logger)
  await startNotifyMonitor(server.logger)

  await server.start()
  server.logger.info(`Server running on ${server.info.uri}`)
  setup(server.logger)
}

process.on('SIGTERM', async () => {
  await stopMessaging()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stopMessaging()
  process.exit(0)
})

init()
