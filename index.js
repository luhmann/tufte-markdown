const fs = require('fs')
const path = require('path')
const unified = require('unified')
const markdown = require('remark-parse')
const html = require('remark-html')
var highlight = require('remark-highlight.js')
const math = require('remark-math')
const katex = require('remark-html-katex')
const report = require('vfile-reporter')
const sidenotes = require('./remark-sidenotes')
const toSection = require('./remark-p-to-section')

const md = fs.readFileSync(path.resolve(__dirname, 'tufte.md'))

const tree = unified()
  .use(markdown)
  .use(math)
  .use(katex)
  .use(highlight)
  .use(sidenotes)
  .use(toSection)
  .use(html)
  //   .parse(md);
  .process(md, (err, file) => {
    console.error(report(err || file))
    fs.writeFileSync(path.resolve(__dirname, 'output.html'), String(file))
    console.log(String(file))
  })

// console.dir(tree, { depth: null });

// tree.run();
