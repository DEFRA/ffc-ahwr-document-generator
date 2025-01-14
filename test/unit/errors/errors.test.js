import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'
import { errorPlugin } from '../../../app/plugins/errors'

describe('errors plugin', () => {
  let server

  const MOCK_LOG = jest.fn()

  beforeEach(async () => {
    server = Hapi.server()

    server.route({
      method: 'GET',
      path: '/example',
      handler: (request, h) => {
        const { boom } = request.query

        request.log = MOCK_LOG

        if (boom === 'true') {
          return Boom.internal('Err message')
        }

        return 'Success'
      }
    })

    await server.register(errorPlugin)
    await server.initialize()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('logs error when response is a boom error', async () => {
    const request = {
      method: 'GET',
      url: '/example?boom=true'
    }

    const response = await server.inject(request)

    expect(MOCK_LOG).toHaveBeenCalledWith('error', {
      statusCode: 500,
      message: 'Err message',
      payloadMessage: ''
    })
    expect(response.statusCode).toBe(500)
  })

  test('continues if response is not a boom error', async () => {
    const request = {
      method: 'GET',
      url: '/example?boom=false'
    }

    const response = await server.inject(request)

    expect(MOCK_LOG).toHaveBeenCalledTimes(0)
    expect(response.statusCode).toBe(200)
  })
})
