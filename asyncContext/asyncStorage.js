const { AsyncLocalStorage } = require('async_hooks')

const asyncStorage = new AsyncLocalStorage()
module.exports.asyncStorage = asyncStorage

const defaultStore = {
  requestId: null,
  otherData: null,
}
module.exports.defaultStore = defaultStore
