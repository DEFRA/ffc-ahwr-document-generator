const styles = require('./styles')
const generateContent = require('./content')
const { A4 } = require('./page-sizes')

const createDocumentDefinition = (data) => {
  return {
    pageSize: A4,
    content: generateContent(data),
    styles,
    defaultStyle: styles.default
  }
}

module.exports = createDocumentDefinition
