const documentRequest = require('./document-request')
const user = require('./user')

module.exports = {
  ...documentRequest,
  ...user
}
