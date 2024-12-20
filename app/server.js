const hapi = require('@hapi/hapi')
const config = require('./config')

let server

async function createServer () {
  // Create the hapi server
  server = hapi.server({
    port: config.port,
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
  await server.register(require('./plugins/errors'))
  await server.register(require('./plugins/router'))

  return server
}

module.exports = {
  createServer,
  server
}
