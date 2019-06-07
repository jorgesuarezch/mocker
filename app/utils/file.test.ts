import {
  MOCKS_DIR,
  generateFileName,
  getOrCreateExpectationDir,
  readJSON,
  saveJSON,
  saveFile,
} from './file'

const fs = require('fs')
jest.mock('fs')

describe('file utils', () => {
  const DEFAULT_PATH: string = `${MOCKS_DIR}/empty`
  beforeEach(() => {
    fs.existsSync.mockReset()
    fs.mkdirSync.mockReset()
    fs.writeFileSync.mockReset()
    fs.readFileSync.mockReset()
  })
  describe('getOrCreateExpectationDir', () => {
    it('should create the directory and return its path', () => {
      fs.existsSync.mockReturnValue(false)
      const result = getOrCreateExpectationDir('empty')

      expect(fs.mkdirSync).toHaveBeenCalled()
      expect(result.endsWith(DEFAULT_PATH)).toBeTruthy()
    })
    it('should return the path if path already exists', () => {
      fs.existsSync.mockReturnValue(true)
      const result = getOrCreateExpectationDir('empty')

      expect(fs.mkdirSync).not.toHaveBeenCalled()
      expect(result.endsWith(DEFAULT_PATH)).toBeTruthy()
    })

    it('should create a relative path even when an absolute path is given', () => {
      fs.existsSync.mockReturnValue(true)
      const result = getOrCreateExpectationDir('/empty')

      expect(fs.mkdirSync).not.toHaveBeenCalled()
      expect(result.endsWith(DEFAULT_PATH)).toBeTruthy()
    })
  })

  describe('saveFile', () => {
    it('should save the file in the given path with the given content', () => {
      const filename: string = 'test.json'
      const content: string = '{}'
      saveFile(DEFAULT_PATH, filename, content)
      expect(fs.writeFileSync).toHaveBeenCalledWith(`${DEFAULT_PATH}/${filename}`, content)
    })
  })

  describe('saveJSON', () => {
    it('should save the file in the given path with the a parsed JSON', () => {
      const filename: string = 'test.json'
      const object = { prop: 'any' }
      saveJSON(DEFAULT_PATH, filename, object)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `${DEFAULT_PATH}/${filename}`,
        JSON.stringify(object),
      )
    })
  })

  describe('generateFileName', () => {
    it('should generate a random name with .json as default extension', () => {
      expect(generateFileName()).toMatch(/\.json$/gi)
    })

    it('should generate a random name with the given extension extension', () => {
      expect(generateFileName('.txt')).toMatch(/\.txt$/gi)
    })
  })

  describe('readJSON', () => {
    it('Should read a JSON file and parse it', () => {
      const content: string = `{"data": "any"}`
      const filename: string = 'test.json'
      const file: string = `${DEFAULT_PATH}/${filename}`

      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(content)

      const result = readJSON(file)

      expect(result).toMatchObject({ data: 'any' })
    })

    it('Should return empty object if content is not a valid JSON', () => {
      const content: string = `funny`
      const filename: string = 'test.json'
      const file: string = `${DEFAULT_PATH}/${filename}`

      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(content)

      const result = readJSON(file)

      expect(result).toMatchObject([])
    })

    it('Should return empty object if path does not exist?', () => {
      const filename: string = 'test.json'
      const file: string = `${DEFAULT_PATH}/${filename}`

      fs.existsSync.mockReturnValue(false)

      const result = readJSON(file)

      expect(result).toMatchObject([])
      expect(fs.readFileSync).not.toHaveBeenCalled()
    })
  })
})
