import fs from 'fs'
import path from 'path'
import unified from 'unified'
import markdown from 'remark-parse'
import figureParser from './remark-figure-parser'

const createParser = unified()
  .use(markdown)
  .use(figureParser)

describe('simple `figure`-tag', () => {
  describe('with text content', () => {
    let parser
    let markup
    let result
    beforeEach(() => {
      parser = createParser()
      markup = fs.readFileSync(
        path.resolve(__dirname, '__fixtures__', 'with-text-content.md')
      )

      result = parser.parse(markup).children[0]
    })

    it('should match snapshot', () => {
      expect(result).toMatchSnapshot()
    })

    it('should parse block as `tufeFigure`-Node', () => {
      expect(result.type).toEqual('tufteFigure')
    })

    it('should set the `openingHtml`-attribute', () => {
      expect(result.attributes.openingHtml).toEqual('<figure>')
    })

    it('should set the `closingHtml`-attribute', () => {
      expect(result.attributes.closingHtml).toEqual('</figure>')
    })

    it('should parse children as text-node', () => {
      expect(result.children[0].type).toEqual('text')
      expect(result.children).toHaveLength(1)
    })
  })

  describe('with markdown-content', () => {
    let parser
    let markup
    let result
    beforeEach(() => {
      parser = createParser()
      markup = fs.readFileSync(
        path.resolve(__dirname, '__fixtures__', 'with-markdown-content.md')
      )

      result = parser.parse(markup).children[0]
    })

    it('should match snapshot', () => {
      expect(result).toMatchSnapshot()
    })

    it('should parse children into the three corresponding notes', () => {
      expect(result.children).toHaveLength(3)
    })

    it('should parse the children into the correct nodes', () => {
      expect(result.children).toContainEqual(
        expect.objectContaining({
          type: 'image',
        })
      )
      expect(result.children).toContainEqual(
        expect.objectContaining({ type: 'footnote' })
      )
    })
  })
})

describe('`figure`-tag with additional classes', () => {
  let parser
  let markup
  let result
  beforeEach(() => {
    parser = createParser()
    markup = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__', 'with-additional-classnames.md')
    )

    result = parser.parse(markup).children[0]
  })

  it('should match snapshot', () => {
    expect(result).toMatchSnapshot()
  })

  it('should correctly include additional classes in `openingHtml`', () => {
    expect(result.attributes.openingHtml).toContain('fullwidth')
    expect(result.attributes.openingHtml).toContain('foo')
  })
})

describe('with surrounding markdown', () => {
  let parser
  let markup
  let result
  beforeEach(() => {
    parser = createParser()
    markup = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__', 'with-surrounding-markdown.md')
    )

    result = parser.parse(markup)
  })

  it('should match snapshot', () => {
    expect(result).toMatchSnapshot()
  })
})
