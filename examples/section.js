const fs = require('fs')
const path = require('path')
const configureParser = require('@tufte-markdown/parser')

const parse = configureParser()
const md = fs.readFileSync(path.resolve(__dirname, 'md', 'section.md'))

const result = parse(md)

console.log(result)
