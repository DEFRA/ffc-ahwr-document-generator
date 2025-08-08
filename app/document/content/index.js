import { title } from './title.js'
import { ahwrApplicationDetails } from './ahwr-application-details.js'

export const createContent = (data) => {
  return [
    title(data.scheme),
    mainContentMap.get(data.scheme ?? 'default')(data)
  ]
}

const generateDefaultContent = (data) => {
  return ahwrApplicationDetails(data)
}

const mainContentMap = new Map([
  ['default', generateDefaultContent],
  ['ahwr', generateDefaultContent]
])
