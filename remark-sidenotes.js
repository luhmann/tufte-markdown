'use strict'

const visit = require('unist-util-visit')
const shortid = require('shortid')
const select = require('unist-util-select')
const findAfter = require('unist-util-find-after')
const parents = require('unist-util-parents')
const findAllAfter = require('unist-util-find-all-after')
const map = require('unist-util-map')
const modifyChildren = require('unist-util-modify-children')
const is = require('unist-util-is')
const deepEqual = require('fast-equals').deepEqual
const squeezeParagraphs = require('mdast-squeeze-paragraphs')

// Input
// One of the most distinctive features of Tufte's style is his extensive use of
// sidenotes.[^3] Sidenotes are like footnotes, except they don't force the reader
// to jump their eye to the bottom of the page, but instead display off to the side
// in the margin. Perhaps you have noticed their use in this document already. You
// are very astute.

// [^3]: This is a sidenote.

// Tree:
// { type: 'root',
// children:
//  [ { type: 'paragraph',
//      children:
//       [ { type: 'text',
//           value: 'One of the most distinctive features of Tufte\'s style is his extensive use of\nsidenotes.',
//           position:
//            Position {
//              start: { line: 1, column: 1, offset: 0 },
//              end: { line: 2, column: 11, offset: 88 },
//              indent: [ 1 ] } },
//         { type: 'linkReference',
//           identifier: '^3',
//           referenceType: 'shortcut',
//           children:
//            [ { type: 'text',
//                value: '^3',
//                position:
//                 Position {
//                   start: { line: 2, column: 12, offset: 89 },
//                   end: { line: 2, column: 14, offset: 91 },
//                   indent: [] } } ],
//           position:
//            Position {
//              start: { line: 2, column: 11, offset: 88 },
//              end: { line: 2, column: 15, offset: 92 },
//              indent: [] } },
//         { type: 'text',
//           value: ' Sidenotes are like footnotes, except they don\'t force the reader\nto jump their eye to the bottom of the page, but instead display off to the side\nin the margin. Perhaps you have noticed their use in this document already. You\nare very astute.',
//           position:
//            Position {
//              start: { line: 2, column: 15, offset: 92 },
//              end: { line: 5, column: 17, offset: 335 },
//              indent: [ 1, 1, 1 ] } } ],
//      position:
//       Position {
//         start: { line: 1, column: 1, offset: 0 },
//         end: { line: 5, column: 17, offset: 335 },
//         indent: [ 1, 1, 1, 1 ] } },
//    { type: 'paragraph',
//      children:
//       [ { type: 'linkReference',
//           identifier: '^3',
//           referenceType: 'shortcut',
//           children:
//            [ { type: 'text',
//                value: '^3',
//                position:
//                 Position {
//                   start: { line: 7, column: 2, offset: 338 },
//                   end: { line: 7, column: 4, offset: 340 },
//                   indent: [] } } ],
//           position:
//            Position {
//              start: { line: 7, column: 1, offset: 337 },
//              end: { line: 7, column: 5, offset: 341 },
//              indent: [] } },
//         { type: 'text',
//           value: ': This is a sidenote.',
//           position:
//            Position {
//              start: { line: 7, column: 5, offset: 341 },
//              end: { line: 7, column: 26, offset: 362 },
//              indent: [] } } ],
//      position:
//       Position {
//         start: { line: 7, column: 1, offset: 337 },
//         end: { line: 7, column: 26, offset: 362 },
//         indent: [] } } ],
// position:
//  { start: { line: 1, column: 1, offset: 0 },
//    end: { line: 10, column: 1, offset: 365 } } }

// Result
// <p>One of the most distinctive features of Tufte’s style is his extensive use of sidenotes.
// <label for="sn-extensive-use-of-sidenotes"
//     class="margin-toggle sidenote-number"></label>
// <input type="checkbox" id="sn-extensive-use-of-sidenotes" class="margin-toggle" />
// <span class="sidenote">This is a sidenote.</span></p>

module.exports = sidenotes

function sidenotes() {
  return transformer
}

const generateLabel = () => `sn-${shortid.generate()}`
const generateInput = label => ({
  type: 'emphasis',
  data: {
    hName: 'input',
    hProperties: {
      type: 'checkbox',
      className: 'margin-toggle',
      id: label,
    },
  },
})

const extractNote = note => note.value.substr(1).trim()

const getReplacement = (label, notes) => {
  //notes[0].value = extractNote(notes[0])
  return [
    {
      type: 'html',
      value: `<label for="${label}" class="margin-toggle sidenote-number"></label>`,
    },
    {
      type: 'html',
      value: `<input type="checkbox" id="${label}" class="margin-toggle" />`,
    },
    {
      type: 'html',
      value: '<span class="sidenote">',
    },
    ...notes,
    {
      type: 'html',
      value: '</span>',
    },
  ]
}

function transformer(tree) {
  const replaceMap = new Map()
  const parentsTree = parents(tree)
  const sidenotes = select(parentsTree, 'linkReference[identifier^=^]')
  const ids = [...new Set(sidenotes.map(item => item.identifier))]

  // console.log('rhino', select(parentsTree, '*[identifier=^rhino]'))

  ids.forEach(id => {
    const nodes = select(parentsTree, `*[identifier=${id}]`)
    const [anchor, target] = nodes.sort(
      (a, b) => a.position.start.line - b.position.start.line
    )
    // console.log('👉', anchor)
    // console.log('🎯', target)

    const notes = findAllAfter(target.parent, target)
    const replacement = getReplacement(generateLabel(), notes)

    replaceMap.set(id, {
      anchor,
      target,
      replacement,
    })
  })

  visit(tree, 'linkReference', (node, index, parent) => {
    if (replaceMap.has(node.identifier)) {
      const replacement = replaceMap.get(node.identifier)

      if (deepEqual(replacement.anchor, node)) {
        parent.children.splice(index, 1, ...replacement.replacement)
      }

      if (deepEqual(replacement.target, node)) {
        parent.children.splice(0)
      }
    }
  })

  squeezeParagraphs(tree)
}
