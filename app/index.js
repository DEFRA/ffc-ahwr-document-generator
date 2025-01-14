import { setup } from './insights.js'
import 'log-timestamp' // Unsure what this does?
import { startMessaging, stopMessaging } from './messaging/index.js'
import { start as startNotifyMonitor } from './email/notify-monitor.js'
import { createServer } from './server.js'

const init = async () => {
  await startMessaging()
  await startNotifyMonitor()
  const server = await createServer()
  await server.start()
  console.log(`Server running on ${server.info.uri}`)
  setup()
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
