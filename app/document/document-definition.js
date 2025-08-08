import { styles } from './styles.js'
import { createContent } from './content/index.js'
import { pageSizes } from './page-sizes.js'
import { footer } from './content/footer.js'

export const createDocumentDefinition = (data) => {
  return {
    pageSize: pageSizes.A4,
    content: createContent(data),
    footer: footer(data.reference, data.scheme),
    styles,
    defaultStyle: styles.default,
    maxPagesNumber: -1
  }
}
