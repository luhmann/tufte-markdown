import visit from 'unist-util-visit'

function wrapInSection() {
  return transformer
}

export function transformer(tree) {
  const headingsMap = []
  const newTree = []

  visit(tree, 'heading', (node, index) => {
    if (node.depth === 2) headingsMap.push(index)
  })

  if (headingsMap.length) {
    for (let index = 0; index <= headingsMap.length; index++) {
      const sectionStartIndex = index === 0 ? 0 : headingsMap[index - 1]
      const sectionEndIndex =
        index === headingsMap.length ? tree.children.length : headingsMap[index]
      const children = tree.children.slice(sectionStartIndex, sectionEndIndex)

      if (children.length) {
        const wrapperNode = {
          type: 'paragraph',
          children,
          data: { hName: 'section', hProperties: { className: 'level2' } },
        }

        newTree.push(wrapperNode)
      }
    }

    tree.children = newTree
  }

  return tree
}

export default wrapInSection
