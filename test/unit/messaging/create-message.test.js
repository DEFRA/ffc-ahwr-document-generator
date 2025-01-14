import { createMessage } from '../../../app/messaging/create-message'

describe('createMessage', () => {
  test('returns an object with body, type, and source', () => {
    const body = 'Hello'
    const type = 'text'
    const message = createMessage(body, type)

    expect(message).toEqual({ body, type, source: 'ffc-ahwr-document-generator' })
  })

  test('allows passing in options', () => {
    const body = 'Hello'
    const type = 'text'
    const options = { id: '123' }
    const message = createMessage(body, type, options)

    expect(message).toEqual({ body, type, source: 'ffc-ahwr-document-generator', id: options.id })
  })
})
