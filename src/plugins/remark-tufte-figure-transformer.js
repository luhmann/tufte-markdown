const visit = require('unist-util-visit')
const HTML = require('html-parse-stringify')

module.exports = tufteFigureTransformer

function tufteFigureTransformer() {
  return transformer
}

function transformer(tree) {
  visit(tree, 'tufteFigure', (node, index, parent) => {
    const openTagAst = HTML.parse(node.attributes.openingHtml)

    let figureProperties

    if (openTagAst) {
      if (openTagAst[0].attrs.class) {
        figureProperties = {
          className: openTagAst[0].attrs.class,
        }
      }
    }

    const replacement = {
      type: 'paragraph',
      children: node.children,
      data: {
        hName: 'figure',
        hProperties: figureProperties,
      },
    }
    parent.children.splice(index, 1, replacement)
  })
}
