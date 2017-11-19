const visit = require('unist-util-visit')

module.exports = toSection

function toSection() {
  return transformer
}

function transformer(tree) {
  visit(tree, 'paragraph', (node, index) => {
    node.data = {
      hName: 'section',
    }
  })
}
