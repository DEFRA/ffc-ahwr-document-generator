import { healthRoutes } from '../routes/./health.js'
import { redactPiiRequestHandlers } from '../routes/redact-pii.js'

const routes = [...healthRoutes, ...redactPiiRequestHandlers]

export const routerPlugin = {
  plugin: {
    name: 'router',
    register: (server) => {
      server.route(routes)
    }
  }
}
