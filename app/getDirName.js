import path from 'path'
import { fileURLToPath } from 'url'

export const getDirName = () => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  return __dirname
}
