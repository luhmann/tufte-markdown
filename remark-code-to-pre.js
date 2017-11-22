const visit = require('unist-util-visit')

function codeToPre() {
  return transformer
}

function transformer(tree) {
  visit(tree, 'code', node => {
    node.data = {
      hProperties: {
        className: 'code',
      },
    }
  })
}

module.exports = codeToPre
