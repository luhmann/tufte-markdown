const fs = require('fs')
const path = require('path')

const setup = require('./src')
module.exports = setup

// const convert = setup()
// const md = fs.readFileSync(
//   path.resolve(__dirname, 'test', 'fixtures', 'figures.md')
// )
// const result = convert(md)

// console.log('====================== OUT =================')
// fs.writeFileSync(path.resolve(__dirname, 'output.html'), result)
// console.dir(result)
