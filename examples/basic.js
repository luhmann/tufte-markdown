const configureParser = require('@tufte-markdown/parser')

const options = {
  react: false,
}

const parse = configureParser(options)
const result = parse('## Heading **strong** *emphasis*')

console.dir(result)

// <section><h2 id="heading-strong-emphasis">Heading <strong>strong</strong> <em>emphasis</em></h2></section>\n'
