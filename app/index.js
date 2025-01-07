import { setup } from './insights'
import 'log-timestamp' // Unsure what this does?
import { startMessaging, stopMessaging } from './messaging'
import { start as startNotifyMonitor } from './email/notify-monitor'
import { createServer } from './server'

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
