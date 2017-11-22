const shortid = require('shortid')
const visit = require('unist-util-visit')
const select = require('unist-util-select')
const toHAST = require('mdast-util-to-hast')
const toHTML = require('hast-util-to-html')

const MARGINNOTE_SYMBOL = '{-}'

function sidenotes() {
  return transformer
}

const generateLabel = isMarginNote =>
  `${isMarginNote ? 'md' : 'sd'}-${shortid.generate()}`

const getReplacement = ({ isMarginNote, noteHTML }) => {
  const label = generateLabel(isMarginNote)
  const labelCls = `margin-toggle ${isMarginNote ? '' : 'sidenote-number'}`
  const labelSymbol = isMarginNote ? '&#8853;' : ''
  const noteTypeCls = isMarginNote ? 'marginnote' : 'sidenote'

  return [
    {
      type: 'html',
      value: `<label for="${label}" class="${labelCls}">${labelSymbol}</label>`,
    },
    {
      type: 'html',
      value: `<input type="checkbox" id="${label}" class="margin-toggle" />`,
    },
    {
      type: 'html',
      value: `<span class="${noteTypeCls}">`,
    },
    {
      type: 'html',
      value: noteHTML,
    },
    {
      type: 'html',
      value: '</span>',
    },
  ]
}

const coerceToHtml = nodeArray =>
  nodeArray.map(node => toHTML(toHAST(node))).join('') || ''

const extractNoteFromHtml = note => {
  const matches = note.match(/(\s+)*({-})*\s*((.|\n)+)/)

  return {
    isMarginNote: matches[2] === MARGINNOTE_SYMBOL,
    noteHTML: matches[3],
  }
}

function transformer(tree) {
  visit(tree, 'footnoteReference', (node, index, parent) => {
    const target = select(
      tree,
      `footnoteDefinition[identifier=${node.identifier}]`
    )

    if (!target) throw new Error('No coresponding note found')

    const notesAst =
      target[0].children.length && target[0].children[0].type === 'paragraph'
        ? target[0].children[0].children
        : target[0].children

    const nodeDetail = extractNoteFromHtml(coerceToHtml(notesAst))

    parent.children.splice(index, 1, ...getReplacement(nodeDetail))
  })

  visit(tree, 'footnoteDefinition', (node, index, parent) => {
    parent.children.splice(index, 1)
  })

  // "Inline" Footnotes which do not have two parts
  // Syntax: [^{-} <markdown>]
  visit(tree, 'footnote', (node, index, parent) => {
    const notesAst = node.children

    const nodeDetail = extractNoteFromHtml(coerceToHtml(notesAst))

    parent.children.splice(index, 1, ...getReplacement(nodeDetail))
  })
}

module.exports = sidenotes
