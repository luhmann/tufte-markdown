const fs = require('fs')
const path = require('path')
const configureParser = require('@tufte-markdown/parser')

const parse = configureParser()
const md = fs.readFileSync(path.resolve(__dirname, 'md', 'tufte.md'))

const result = parse(md)

console.log(result)

// Will output the parsed tufte.md from https://github.com/jez/tufte-pandoc-css/blob/master/docs/tufte-md/index.md
