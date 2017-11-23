import report from 'vfile-reporter'
import configureParser from './lib'

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

export default setup
