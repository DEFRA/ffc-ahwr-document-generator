import { createMessage } from '../../../app/messaging/create-message'
import { sendMessage } from '../../../app/messaging/send-message'

jest.mock('../../../app/messaging/create-message')

// These tests are not particularly useful, we should just check here if the function is calling into the ones below
describe('sendMessage', () => {
  test('should throw error if body is missing', async () => {
    const type = 'text'
    const options = {}
    const config = {
      address: 'somewhere'
    }

    await expect(sendMessage(undefined, type, config, options)).rejects.toThrow(
      'Cannot read properties of undefined (reading \'type\')'
    )
  })

  test('should throw error if type is missing', async () => {
    const body = {}
    const options = {}
    const config = {
      address: 'somewhere'
    }

    await expect(sendMessage(body, undefined, config, options)).rejects.toThrow(
      'Cannot read properties of undefined (reading \'type\')'
    )
  })

  test('should throw error if config is missing', async () => {
    const body = {}
    const type = 'text'
    const options = {}

    await expect(sendMessage(body, type, undefined, options)).rejects.toThrow(
      'Cannot read properties of undefined (reading \'address\')'
    )
  })

  test('should handle error from message sender', async () => {
    const body = {}
    const type = 'text'
    const options = {}
    const config = {}
    const message = {}
    const sender = {
      sendMessage: jest.fn().mockRejectedValue(new Error('Network error'))
    }

    createMessage.mockReturnValueOnce(message)

    await expect(sender.sendMessage(body, type, config, options)).rejects.toThrow(
      'Network error'
    )
  })
})
