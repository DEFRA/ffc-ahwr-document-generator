import hapi from '@hapi/hapi'
import { appConfig } from './config'
import { errorPlugin } from './plugins/errors'
import { routerPlugin } from './plugins/router'

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

  return server
}
