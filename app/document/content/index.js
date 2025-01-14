import { title } from './title.js'
import { applicationDetails } from './application-details.js'

export const createContent = (data) => {
  return [
    title(),
    applicationDetails(data)
  ]
}
