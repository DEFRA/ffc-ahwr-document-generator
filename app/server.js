import hapi from '@hapi/hapi'
import { appConfig } from './config/index.js'
import { errorPlugin } from './plugins/errors.js'
import { routerPlugin } from './plugins/router.js'
import { logger } from './plugins/logger.js'

export const createServer = async () => {
  // Create the hapi server
  const server = hapi.server({
    port: appConfig.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  // Register the plugins
  await server.register(errorPlugin)
  await server.register(routerPlugin)
  await server.register(logger)

  return server
}
