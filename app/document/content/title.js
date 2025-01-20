import path from 'path'
import { appConfig } from '../../config/index.js'
import { millimetresToPoints } from '../conversion.js'
import { getDirName } from '../../getDirName.js'

export const title = () => {
  const { applyServiceUri } = appConfig
  const imagePath = path.join(getDirName(), 'document', 'images')
  const title = 'Agreement summary: get funding to improve animal health and welfare'

  return {
    stack: [
      { image: `${imagePath}/logo.jpg`, fit: [millimetresToPoints(200), millimetresToPoints(25)], style: 'logo', link: applyServiceUri },
      { text: title, style: 'header', alignment: 'left' }
    ]
  }
}
