import u from 'unist-builder'
import select from 'unist-util-select'
import HTML from 'html-parse-stringify'
import { transformer } from './remark-sidenotes-transformer'

const clone = obj => Object.assign({}, obj)

describe('Sidenotes', () => {
  describe('with target not as its own paragraph', () => {
    let ast
    let subject
    let result
    beforeEach(() => {
      ast = u('root', [
        u('paragraph', [
          u('text', 'Lorem ipsum dolor sed amet'),
          u('footnoteReference', {
            identifier: '^1',
          }),
          u('text', 'dolores adam turing and the gang'),
          u('emphasis', 'rocked'),
          u('text', 'their life'),
        ]),
        u('paragraph', [
          u('footnoteDefinition', { identifier: '^1' }, [
            u('text', 'This is the footnote for identifier ^1'),
            u('emphasis', [u('text', 'This is strong')]),
            u(
              'link',
              { url: 'http://example.org', title: 'Just an example' },
              'Link to example.org'
            ),
          ]),
        ]),
      ])

      subject = clone(ast)
      result = transformer(subject)
    })

    it('should match snapshot', () => {
      expect(result).toMatchSnapshot()
    })

    describe('label-element', () => {
      it('should replace the `footnoteReference` with a `label`', () => {
        expect(select(result, 'html[value^=<label]')).toHaveLength(1)
        expect(select(result, 'footnoteReference')).toHaveLength(0)
      })

      it('should generate the correct identifier for the label', () => {
        const labelNode = HTML.parse(
          select(result, 'html[value^=<label]')[0].value
        )[0]

        expect(labelNode.attrs.for).toEqual('sd-this-is-the-footnote')
      })

      it('should generate the correct css-class for the label', () => {
        const labelNode = HTML.parse(
          select(result, 'html[value^=<label]')[0].value
        )[0]
        expect(labelNode.attrs.class).toEqual('margin-toggle sidenote-number')
      })

      it('should not generate any child notes for the label', () => {
        const labelNode = HTML.parse(
          select(result, 'html[value^=<label]')[0].value
        )[0]
        expect(labelNode.children).toHaveLength(0)
      })
    })

    describe('input-element', () => {
      it('should replace the `footnoteReference` with an `input`', () => {
        expect(select(result, 'html[value^=<input]')).toHaveLength(1)
        expect(select(result, 'footnoteReference')).toHaveLength(0)
      })

      it('should be of type="checkbox"', () => {
        const inputNode = HTML.parse(
          select(result, 'html[value^=<input]')[0].value
        )[0]

        expect(inputNode.attrs.type).toEqual('checkbox')
      })

      it('should generate the correct id', () => {
        const inputNode = HTML.parse(
          select(result, 'html[value^=<input]')[0].value
        )[0]

        expect(inputNode.attrs.id).toEqual('sd-this-is-the-footnote')
      })

      it('should have the correct css-class', () => {
        const inputNode = HTML.parse(
          select(result, 'html[value^=<input]')[0].value
        )[0]

        expect(inputNode.attrs.class).toEqual('margin-toggle')
      })
    })

    describe('sidenote content', () => {
      it('should replace the `footnoteDefinition` with a span element', () => {
        expect(
          select(result, 'html[value^=<span class="sidenote]')
        ).toHaveLength(1)
        expect(select(result, 'footnoteDefinition')).toHaveLength(0)
      })
    })
  })

  describe('with target as paragraph', () => {
    let ast
    let subject
    let result
    beforeEach(() => {
      ast = u('root', [
        u('paragraph', [
          u('text', 'Lorem ipsum dolor sed amet'),
          u('footnoteReference', {
            identifier: '^1',
          }),
          u('text', 'dolores adam turing and the gang'),
          u('emphasis', 'rocked'),
          u('text', 'their life'),
        ]),
        u('paragraph', [
          u('footnoteDefinition', { identifier: '^1' }, [
            u('paragraph', [
              u('text', 'This is the footnote for identifier ^1'),
              u('emphasis', [u('text', 'This is strong')]),
              u(
                'link',
                { url: 'http://example.org', title: 'Just an example' },
                'Link to example.org'
              ),
            ]),
          ]),
        ]),
      ])

      subject = clone(ast)
      result = transformer(subject)
    })

    it('should match the snapshot', () => {
      expect(result).toMatchSnapshot()
    })

    it('should remove the wrapping paragraph from the note-content', () => {
      const note = select(
        result,
        'html[value^=<span class="sidenote] + html'
      )[0]
      expect(note.value).not.toMatch(/^<p>/)
    })
  })

  describe('with no matching `noteDefinition`', () => {
    let ast
    let subject
    beforeEach(() => {
      ast = u('root', [
        u('paragraph', [
          u('text', 'Lorem ipsum dolor sed amet'),
          u('footnoteReference', {
            identifier: '^1',
          }),
          u('text', 'dolores adam turing and the gang'),
          u('emphasis', 'rocked'),
          u('text', 'their life'),
        ]),
      ])

      subject = clone(ast)
    })

    it('should throw an error', () => {
      function transformAst() {
        transformer(subject)
      }
      expect(transformAst).toThrowErrorMatchingSnapshot()
    })
  })
})

describe('Marginnotes', () => {
  describe('with margin-note-indicator inline in text', () => {
    let ast
    let subject
    let result
    beforeEach(() => {
      ast = u('root', [
        u('paragraph', [
          u('text', 'Lorem ipsum dolor sed amet'),
          u('footnoteReference', {
            identifier: '^blue',
          }),
          u('text', 'dolores adam turing and the gang'),
          u('emphasis', 'rocked'),
          u('text', 'their life'),
        ]),
        u('paragraph', [
          u('footnoteDefinition', { identifier: '^blue' }, [
            u('text', '{-} This is the footnote for identifier ^blue'),
            u('emphasis', [u('text', 'This is strong')]),
            u(
              'link',
              { url: 'http://example.org', title: 'Just an example' },
              'Link to example.org'
            ),
          ]),
        ]),
      ])

      subject = clone(ast)
      result = transformer(subject)
    })

    it('should match snapshot', () => {
      expect(result).toMatchSnapshot()
    })

    describe('label-element', () => {
      it('should replace the `footnoteReference` with a `label`', () => {
        expect(select(result, 'html[value^=<label]')).toHaveLength(1)
        expect(select(result, 'footnoteReference')).toHaveLength(0)
      })

      it('should generate the correct identifier for the label', () => {
        const labelNode = HTML.parse(
          select(result, 'html[value^=<label]')[0].value
        )[0]

        expect(labelNode.attrs.for).toEqual('md-this-is-the-footnote')
      })

      it('should generate the correct css-class for the label', () => {
        const labelNode = HTML.parse(
          select(result, 'html[value^=<label]')[0].value
        )[0]
        expect(labelNode.attrs.class).toContain('margin-toggle')
      })

      it('should not generate any child notes for the label', () => {
        const labelNode = HTML.parse(
          select(result, 'html[value^=<label]')[0].value
        )[0]
        expect(labelNode.children[0].content).toContain('&#8853;')
        expect(labelNode.children).toHaveLength(1)
      })
    })

    describe('input-element', () => {
      it('should replace the `footnoteReference` with an `input`', () => {
        expect(select(result, 'html[value^=<input]')).toHaveLength(1)
        expect(select(result, 'footnoteReference')).toHaveLength(0)
      })

      it('should be of type="checkbox"', () => {
        const inputNode = HTML.parse(
          select(result, 'html[value^=<input]')[0].value
        )[0]

        expect(inputNode.attrs.type).toEqual('checkbox')
      })

      it('should generate the correct id', () => {
        const inputNode = HTML.parse(
          select(result, 'html[value^=<input]')[0].value
        )[0]

        expect(inputNode.attrs.id).toEqual('md-this-is-the-footnote')
      })

      it('should have the correct css-class', () => {
        const inputNode = HTML.parse(
          select(result, 'html[value^=<input]')[0].value
        )[0]

        expect(inputNode.attrs.class).toEqual('margin-toggle')
      })
    })

    describe('sidenote content', () => {
      it('should replace the `footnoteDefinition` with a span element', () => {
        expect(
          select(result, 'html[value^=<span class="marginnote]')
        ).toHaveLength(1)
        expect(select(result, 'footnoteDefinition')).toHaveLength(0)
      })
    })
  })

  describe('with margin-note-indicator as own node', () => {
    let ast
    let subject
    let result
    beforeEach(() => {
      ast = u('root', [
        u('paragraph', [
          u('text', 'Lorem ipsum dolor sed amet'),
          u('footnoteReference', {
            identifier: '^red',
          }),
          u('text', 'dolores adam turing and the gang'),
          u('emphasis', 'rocked'),
          u('text', 'their life'),
        ]),
        u('paragraph', [
          u('footnoteDefinition', { identifier: '^red' }, [
            u('text', '{-} \n'),
            u('text', 'This is the footnote for identifier ^red'),
            u('emphasis', [u('text', 'This is strong')]),
            u(
              'link',
              { url: 'http://example.org', title: 'Just an example' },
              'Link to example.org'
            ),
          ]),
        ]),
      ])

      subject = clone(ast)
      result = transformer(subject)
    })

    it('should match snapshot', () => {
      expect(result).toMatchSnapshot()
    })
  })

  describe('with no matching `noteDefinition`', () => {
    let ast
    let subject
    beforeEach(() => {
      ast = u('root', [
        u('paragraph', [
          u('text', 'Lorem ipsum dolor sed amet'),
          u('footnoteReference', {
            identifier: '^blue',
          }),
          u('text', 'dolores adam turing and the gang'),
          u('emphasis', 'rocked'),
          u('text', 'their life'),
        ]),
      ])

      subject = clone(ast)
    })

    it('should throw an error', () => {
      function transformAst() {
        transformer(subject)
      }
      expect(transformAst).toThrowErrorMatchingSnapshot()
    })
  })
})

describe('Inline-Marginnotes', () => {
  let ast
  let subject
  let result
  beforeEach(() => {
    ast = u('root', [
      u('paragraph', [
        u('tufteFigure', [
          u('footnote', [
            u('text', '{-} This is the footnote for identifier ^blue'),
            u('emphasis', [u('text', 'This is strong')]),
            u(
              'link',
              { url: 'http://example.org', title: 'Just an example' },
              'Link to example.org'
            ),
          ]),
          u('image', {
            title: 'bravo',
            url: 'http://example.com',
            alt: 'alpha',
          }),
        ]),
      ]),
    ])

    subject = clone(ast)
    result = transformer(subject)
  })

  it('should match snapshot', () => {
    expect(result).toMatchSnapshot()
  })
})
