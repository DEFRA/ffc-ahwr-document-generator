import { title } from './title'
import { applicationDetails } from './application-details'

export const createContent = (data) => {
  return [
    title(),
    applicationDetails(data)
  ]
}
