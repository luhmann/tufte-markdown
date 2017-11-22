const fs = require('fs')
const path = require('path')
const report = require('vfile-reporter')

const configureParser = require('./parser')

const md = fs.readFileSync(path.resolve(__dirname, 'figures.md'))

const setup = (options = {}) => {
  const parser = configureParser(options)

  return inputMd => {
    try {
      const result = parser.processSync(inputMd)

      return options.react ? result.contents : String(result)
    } catch (err) {
      console.error(report(err))
    }
  }
}

const convert = setup()

module.exports = setup

const result = convert(md)

console.log('====================== OUT =================')
fs.writeFileSync(path.resolve(__dirname, 'output.html'), result)
console.dir(result)
