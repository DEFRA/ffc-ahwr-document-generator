const styles = require('./styles')
const generateContent = require('./content')
const { A4 } = require('./page-sizes')
const footer = require('./content/footer')

const createDocumentDefinition = (data) => {
  return {
    pageSize: A4,
    content: generateContent(data),
    footer: footer(data.reference), 
    styles,
    defaultStyle: styles.default
  }
}

module.exports = createDocumentDefinition
