const unified = require('unified')
const markdown = require('remark-parse')
const html = require('remark-html')
const react = require('remark-react')
const highlight = require('remark-highlight.js')
const math = require('remark-math')
const katex = require('remark-html-katex')
const slug = require('remark-slug')
const textr = require('remark-textr')
const sidenotes = require('./remark-sidenotes')
const wrapInSection = require('./remark-wrap-in-section')
const tufteFigureParser = require('./remark-tufte-figure-parser')
const tufteFigureTransformer = require('./remark-tufte-figure-transformer')

const textrBase = require('typographic-base')

const configureParser = (options = {}) => {
  return unified()
    .use(markdown, {
      commonmark: true,
      footnotes: true,
    })
    .use(math)
    .use(katex)
    .use(highlight)
    .use(slug)
    .use(textr, {
      plugins: [textrBase],
    })
    .use(tufteFigureParser)
    .use(tufteFigureTransformer)
    .use(sidenotes)
    .use(wrapInSection)
    .use(options.react ? react : html)
}

module.exports = configureParser
