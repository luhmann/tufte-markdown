const fs = require('fs')
const path = require('path')
const unified = require('unified')
const markdown = require('remark-parse')
const html = require('remark-html')
const highlight = require('remark-highlight.js')
const math = require('remark-math')
const katex = require('remark-html-katex')
const report = require('vfile-reporter')
const slug = require('remark-slug')
const textr = require('remark-textr')
const sidenotes = require('./remark-sidenotes')
const wrapInSection = require('./remark-wrap-in-section')

const textrBase = require('typographic-base')

const md = fs.readFileSync(path.resolve(__dirname, 'section.md'))

const convert = inputMd => {
  try {
    const result = unified()
      .use(markdown)
      .use(math)
      .use(katex)
      .use(highlight)
      .use(slug)
      .use(sidenotes)
      .use(textr, {
        plugins: [textrBase],
      })
      .use(wrapInSection)
      .use(html)
      .processSync(inputMd)

    return String(result)
  } catch (err) {
    console.error(report(err))
  }
}

module.exports = convert

const result = convert(md)
fs.writeFileSync(path.resolve(__dirname, 'output.html'), result)
console.dir(result, { depth: null })
