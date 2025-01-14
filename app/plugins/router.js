import { healthyRoute } from '../routes/healthy.js'
import { healthzRoute } from '../routes/healthz.js'

const routes = [healthyRoute, healthzRoute]

export const routerPlugin = {
  plugin: {
    name: 'router',
    register: (server) => {
      server.route(routes)
    }
  }
}
