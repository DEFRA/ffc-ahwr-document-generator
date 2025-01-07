import { styles } from './styles'
import { createContent } from './content'
import { pageSizes } from './page-sizes'
import { footer } from './content/footer'

export const createDocumentDefinition = (data) => {
  return {
    pageSize: pageSizes.A4,
    content: createContent(data),
    footer: footer(data.reference),
    styles,
    defaultStyle: styles.default
  }
}
