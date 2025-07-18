import { healthyRoute } from '../routes/healthy.js'
import { healthzRoute } from '../routes/healthz.js'
import { redactPiiRequestHandlers } from '../routes/redact-pii.js'

const routes = [healthyRoute, healthzRoute, ...redactPiiRequestHandlers]

export const routerPlugin = {
  plugin: {
    name: 'router',
    register: (server) => {
      server.route(routes)
    }
  }
}
