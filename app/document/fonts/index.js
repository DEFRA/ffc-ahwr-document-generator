import path from 'path'
import { getDirName } from '../../getDirName.js'

const fontPath = path.join(getDirName(), 'document', 'fonts')

export const fonts = {
  Arial: {
    normal: `${fontPath}/Arial.ttf`,
    bold: `${fontPath}/Arial_Bold.ttf`
  }
}
