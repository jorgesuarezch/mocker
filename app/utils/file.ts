import * as fs from 'fs'
import * as path from 'path'
import { v1 as uuid } from 'uuid'

export const MOCKS_DIR = process.env.MOCKS_DIR || 'app/mocks'

export const saveFile = (path: string, filename: string, content: string) => {
  fs.writeFileSync(`${path}/${filename}`, content)
}

export const saveJSON = (path: string, filename: string, object: any) => {
  saveFile(path, filename, JSON.stringify(object))
}

export const getOrCreateExpectationDir = (targetPath: string): string => {
  const segments = targetPath.split('/')
  const dirToCreate: string = path.resolve(MOCKS_DIR, ...segments)
  if (!fs.existsSync(dirToCreate)) {
    fs.mkdirSync(dirToCreate, { recursive: true })
  }

  return dirToCreate
}

export const generateFileName = (extension = '.json'): string => {
  return `${uuid()}${extension}`
}

export const readJSON = (path: string): any => {
  if (fs.existsSync(path)) {
    const content = fs.readFileSync(path).toString()
    try {
      return JSON.parse(content)
    } catch (error) {
      return []
    }
  }
  return []
}
