import { healthyRoute } from '../routes/healthy'
import { healthzRoute } from '../routes/healthz'

const routes = [healthyRoute, healthzRoute]

export const routerPlugin = {
  plugin: {
    name: 'router',
    register: (server) => {
      server.route(routes)
    }
  }
}
