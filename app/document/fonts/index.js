import path from 'path'
import { getDirName } from '../../getDirName.js'

const fontPath = path.resolve(getDirName())

export const fonts = {
  Arial: {
    normal: `${fontPath}/Arial.ttf`,
    bold: `${fontPath}/Arial_Bold.ttf`
  }
}
