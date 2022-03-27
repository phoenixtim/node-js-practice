const { asyncStorage } = require('./asyncStorage')

class Logger {
  static log(...args) {
    // eslint-disable-next-line no-console
    console.log('I print log:', ...args, 'Storage', asyncStorage.getStore())
  }
}

module.exports.Logger = Logger
