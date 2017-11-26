import u from 'unist-builder'
import { transformer } from './remark-figure-transformer'

describe('with text-content', () => {
  let ast
  let result
  beforeEach(() => {
    ast = u('root', [
      u(
        'tufteFigure',
        {
          attributes: {
            openingHtml: '<figure>',
            closingHtml: '</figure>',
          },
        },
        [u('text', 'This is a text content within a parsed tufte figure')]
      ),
    ])

    result = transformer(ast).children[0]
  })

  it('should match snapshot', () => {
    expect(result).toMatchSnapshot()
  })

  it('should output a `paragraph`-node', () => {
    expect(result.type).toEqual('paragraph')
  })

  it('should contain the hints that the paragraph is rendered as `figure`', () => {
    expect(result.data.hName).toEqual('figure')
  })

  it('should pass on the children', () => {
    expect(result.children).toHaveLength(1)
    expect(result.children[0].type).toEqual('text')
  })
})

describe('with markdown-content', () => {
  let ast
  let result
  beforeEach(() => {
    ast = u('root', [
      u(
        'tufteFigure',
        {
          attributes: {
            openingHtml: '<figure>',
            closingHtml: '</figure>',
          },
        },
        [
          u('text', 'This is a text content within a parsed tufte figure'),
          u('image', { url: 'http://example.org/foo.png' }),
        ]
      ),
    ])

    result = transformer(ast).children[0]
  })

  it('should match snapshot', () => {
    expect(result).toMatchSnapshot()
  })
})

describe('with additional classes', () => {
  let ast
  let result
  beforeEach(() => {
    ast = u('root', [
      u(
        'tufteFigure',
        {
          attributes: {
            openingHtml: '<figure class="fullwidth">',
            closingHtml: '</figure>',
          },
        },
        [
          u('text', 'This is a text content within a parsed tufte figure'),
          u('image', { url: 'http://example.org/foo.png' }),
        ]
      ),
    ])

    result = transformer(ast).children[0]
  })

  it('should match snapshot', () => {
    expect(result).toMatchSnapshot()
  })

  it('should pass on classes to `paragraph`-node', () => {
    expect(result.data.hProperties.className).toEqual('fullwidth')
  })
})
