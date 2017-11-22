const report = require('vfile-reporter')

const configureParser = require('./parser')

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

module.exports = setup
