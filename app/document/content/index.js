const title = require('./title')
const applicationDetails = require('./application-details')
const footer = require('./footer')

const createContent = (data) => {
  return [
    title(),
    applicationDetails(data),
  ]
}

module.exports = createContent
