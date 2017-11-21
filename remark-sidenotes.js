const visit = require('unist-util-visit')
const shortid = require('shortid')
const select = require('unist-util-select')
const findAfter = require('unist-util-find-after')
const parents = require('unist-util-parents')
const findAllAfter = require('unist-util-find-all-after')
const deepEqual = require('fast-equals').deepEqual
const squeezeParagraphs = require('mdast-squeeze-paragraphs')
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

const extractNoteFromHtml = (target, note) => {
  // Marginnote identifier can either appear in text
  // or when targetNode is parsed as type=definition as its url-property
  const matches = note.match(/(:\s+)*({-})*\s*((.|\n)+)/)
  const hasMarginNoteUrl =
    target.type === 'definition' &&
    target.url &&
    target.url === MARGINNOTE_SYMBOL

  return {
    isMarginNote: matches[2] === MARGINNOTE_SYMBOL || hasMarginNoteUrl,
    noteHTML: matches[3],
  }
}

const coerceToHtml = nodeArray =>
  nodeArray.map(node => toHTML(toHAST(node))).join('')

const getNoteBodyAst = targetNode => {
  // Sidenotes can appear as children or on root level, depending on that they will be wrapped in a paragraph or not
  // we need to differentiate so we co not match the whole document after the sidenote
  const searchMethod =
    targetNode.parent.type === 'root' ? findAfter : findAllAfter
  const notes = searchMethod(targetNode.parent, targetNode)

  return Array.isArray(notes) ? notes : [notes]
}

function transformer(tree) {
  const replaceMap = new Map()
  const parentsTree = parents(tree)
  const sidenotes = select(parentsTree, 'linkReference[identifier^=^]')
  const ids = [...new Set(sidenotes.map(item => item.identifier))]

  ids.forEach(id => {
    const nodes = select(parentsTree, `*[identifier=${id}]`)
    const [anchorNode, targetNode] = nodes.sort(
      (a, b) => a.position.start.line - b.position.start.line
    )
    // console.log('👉', anchorNode)
    // console.log('🎯', targetNode)

    const noteContent = getNoteBodyAst(targetNode)
    const noteDetail = extractNoteFromHtml(
      targetNode,
      coerceToHtml(noteContent)
    )
    const replacement = getReplacement(noteDetail)

    replaceMap.set(id, {
      anchorNode,
      targetNode,
      replacement,
    })
  })

  visit(tree, 'linkReference', (node, index, parent) => {
    if (replaceMap.has(node.identifier)) {
      const replacement = replaceMap.get(node.identifier)

      if (deepEqual(replacement.anchorNode, node)) {
        parent.children.splice(index, 1, ...replacement.replacement)
      }

      if (deepEqual(replacement.targetNode, node)) {
        parent.children.splice(0)
      }
    }
  })

  squeezeParagraphs(tree)
}

module.exports = sidenotes
