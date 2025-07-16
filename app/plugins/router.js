import { healthyRoute } from '../routes/healthy.js'
import { healthzRoute } from '../routes/healthz.js'
import { piiRedactRequestHandlers } from '../routes/redact-pii.js'

const routes = [healthyRoute, healthzRoute, ...piiRedactRequestHandlers]

export const routerPlugin = {
  plugin: {
    name: 'router',
    register: (server) => {
      server.route(routes)
    }
  }
}
