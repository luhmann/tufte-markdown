import fs from 'fs'
import path from 'path'
import generateParser from '@tufte-markdown/parser'

const FIXTURES_BASE_PATH = path.resolve(__dirname, 'fixtures')

const getTestInput = () => {
  const dirCont = fs.readdirSync(FIXTURES_BASE_PATH)
  return dirCont.filter(file => file.match(/.*\.(md)/gi))
}

const getFile = file => fs.readFileSync(path.resolve(FIXTURES_BASE_PATH, file))

describe('with target HTML', () => {
  let parse

  beforeEach(() => {
    parse = generateParser()
  })

  getTestInput().forEach(file => {
    it(`should convert "${file}" correctly`, () => {
      expect(parse(getFile(file))).toMatchSnapshot()
    })
  })
})

describe('with target React', () => {
  let parse

  beforeEach(() => {
    parse = generateParser({ react: true })
  })

  getTestInput().forEach(file => {
    it(`should convert "${file}" correctly`, () => {
      expect(parse(getFile(file))).toMatchSnapshot()
    })
  })
})
