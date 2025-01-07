import path from 'path'
import { appConfig } from '../../config'
import { millimetresToPoints } from '../conversion'

const { applyServiceUri } = appConfig

const imagePath = path.join(__dirname, '../', 'images')

export const title = () => {
  const title = 'Agreement summary: get funding to improve animal health and welfare'

  return {
    stack: [
      { image: `${imagePath}/logo.jpg`, fit: [millimetresToPoints(200), millimetresToPoints(25)], style: 'logo', link: applyServiceUri },
      { text: title, style: 'header', alignment: 'left' }
    ]
  }
}
