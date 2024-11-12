const createMessage = (body, type, options) => {
  return {
    body,
    type,
    source: 'ffc-ahwr-document-generator',
    ...options
  }
}

module.exports = createMessage
