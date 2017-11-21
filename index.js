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
const frontmatter = require('remark-frontmatter')
const textr = require('remark-textr')
const sidenotes = require('./remark-sidenotes')
const toSection = require('./remark-p-to-section')

const textrBase = require('typographic-base')

const md = fs.readFileSync(path.resolve(__dirname, 'tufte.md'))

unified()
  .use(markdown)
  .use(math)
  .use(katex)
  .use(highlight)
  .use(slug)
  .use(sidenotes)
  .use(frontmatter)
  .use(textr, {
    plugins: [textrBase],
  })
  // .use(toSection)
  .use(html)
  //   .parse(md);
  .process(md, (err, file) => {
    console.error(report(err || file))
    fs.writeFileSync(path.resolve(__dirname, 'output.html'), String(file))
    console.log(String(file))
  })
