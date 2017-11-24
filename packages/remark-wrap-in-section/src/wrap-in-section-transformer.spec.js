import u from 'unist-builder'
import { transformer } from './wrap-in-section-transformer'

const clone = obj => Object.assign({}, obj)

describe('with empty block', () => {
  let emptyAst
  beforeEach(() => {
    emptyAst = u('root', [])
  })

  it('should not wrap anything', () => {
    expect(transformer(clone(emptyAst))).toEqual(emptyAst)
  })
})

describe('with single block - no headings', () => {
  let ast
  beforeEach(() => {
    ast = u('root', [u('paragraph', [u('text', 'Some text')])])
  })

  it('should not wrap anything', () => {
    expect(transformer(clone(ast))).toEqual(ast)
  })
})
describe('with multiple blocks - no headings', () => {
  let ast
  beforeEach(() => {
    ast = u('root', [
      u('paragraph', [u('text', 'Some text')]),
      u('paragraph', [u('text', 'Some text')]),
    ])
  })

  it('should not wrap anything', () => {
    expect(transformer(clone(ast))).toEqual(ast)
  })
})

describe('with single level-2-heading', () => {
  describe('and no preceding block', () => {
    let ast
    let subject
    beforeEach(() => {
      ast = u('root', [
        u('heading', { depth: 2 }, 'Heading 2'),
        u('paragraph', [u('text', 'Some text')]),
        u('paragraph', [u('text', 'Some text')]),
      ])

      subject = clone(ast)
    })

    it('should match snapshot', () => {
      expect(transformer(subject)).toMatchSnapshot()
    })

    it('should have two children', () => {
      expect(transformer(subject).children).toHaveLength(1)
    })

    it('should render the wrapped paragraph as section', () => {
      expect(transformer(subject).children[0].data.hName).toEqual('section')
    })
  })

  describe('and preceding blocks', () => {
    let ast
    let subject
    beforeEach(() => {
      ast = u('root', [
        u('paragraph', [u('text', 'Some text')]),
        u('paragraph', [u('text', 'Some text')]),
        u('heading', { depth: 2 }, 'Heading 2'),
        u('paragraph', [u('text', 'Some text')]),
        u('paragraph', [u('text', 'Some text')]),
      ])

      subject = clone(ast)
    })

    it('should match snapshot', () => {
      expect(transformer(subject)).toMatchSnapshot()
    })

    it('should have two children', () => {
      expect(transformer(subject).children).toHaveLength(2)
    })

    it('should render the first wrapped paragraph as section', () => {
      expect(transformer(subject).children[0].data.hName).toEqual('section')
    })

    it('should render the second wrapped paragraph as section', () => {
      expect(transformer(subject).children[1].data.hName).toEqual('section')
    })
  })
})

describe('with multiple-level-2-headings', () => {
  describe('and no preceding block', () => {
    let ast
    let subject
    beforeEach(() => {
      ast = u('root', [
        u('heading', { depth: 2 }, 'Heading 2'),
        u('paragraph', [u('text', 'Some text')]),
        u('paragraph', [u('text', 'Some text')]),
        u('heading', { depth: 2 }, 'Heading 2'),
        u('paragraph', [u('text', 'Some text')]),
        u('paragraph', [u('text', 'Some text')]),
        u('heading', { depth: 2 }, 'Heading 2'),
        u('paragraph', [u('text', 'Some text')]),
        u('paragraph', [u('text', 'Some text')]),
      ])

      subject = clone(ast)
    })

    it('should match snapshot', () => {
      expect(transformer(subject)).toMatchSnapshot()
    })

    it('should have two children', () => {
      expect(transformer(subject).children).toHaveLength(3)
    })
  })

  describe('and preceding blocks', () => {
    let ast
    let subject
    beforeEach(() => {
      ast = u('root', [
        u('paragraph', [u('text', 'Some text')]),
        u('paragraph', [u('text', 'Some text')]),
        u('heading', { depth: 2 }, 'Heading 2'),
        u('paragraph', [u('text', 'Some text')]),
        u('paragraph', [u('text', 'Some text')]),
        u('heading', { depth: 2 }, 'Heading 2'),
        u('paragraph', [u('text', 'Some text')]),
        u('paragraph', [u('text', 'Some text')]),
        u('heading', { depth: 2 }, 'Heading 2'),
        u('paragraph', [u('text', 'Some text')]),
        u('paragraph', [u('text', 'Some text')]),
        u('heading', { depth: 2 }, 'Heading 2'),
        u('paragraph', [u('text', 'Some text')]),
        u('paragraph', [u('text', 'Some text')]),
      ])

      subject = clone(ast)
    })

    it('should match snapshot', () => {
      expect(transformer(subject)).toMatchSnapshot()
    })

    it('should have two children', () => {
      expect(transformer(subject).children).toHaveLength(5)
    })
  })
})

describe('with mixed nested headings', () => {
  let ast
  let subject
  beforeEach(() => {
    ast = u('root', [
      u('paragraph', [u('text', 'Some text')]),
      u('paragraph', [u('text', 'Some text')]),
      u('heading', { depth: 2 }, 'Heading 2'),
      u('heading', { depth: 3 }, 'Heading 3'),
      u('paragraph', [u('text', 'Some text')]),
      u('heading', { depth: 4 }, 'Heading 4'),
      u('paragraph', [u('text', 'Some text')]),
      u('heading', { depth: 2 }, 'Heading 2'),
      u('paragraph', [u('text', 'Some text')]),
      u('heading', { depth: 5 }, 'Heading 5'),
      u('paragraph', [u('text', 'Some text')]),
      u('heading', { depth: 2 }, 'Heading 2'),
      u('paragraph', [u('text', 'Some text')]),
      u('paragraph', [u('text', 'Some text')]),
    ])

    subject = clone(ast)
  })

  it('should match snapshot', () => {
    expect(transformer(subject)).toMatchSnapshot()
  })

  it('should have have wrapped into four children', () => {
    expect(transformer(subject).children).toHaveLength(4)
  })
})
