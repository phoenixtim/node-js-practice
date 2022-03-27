const { asyncStorage } = require('./asyncStorage')
const { Logger } = require('./logging')

class OtherClass {
  // eslint-disable-next-line class-methods-use-this
  otherFunction() {
    const store = asyncStorage.getStore()
    store.otherData = 'abc'
    Logger.log('OtherClass.otherFunction doing its work and has modified store.otherData:', store)
  }

  // eslint-disable-next-line class-methods-use-this
  async asyncFunction() {
    Logger.log('OtherClass.asyncFunction start')
    await new Promise(resolve => { setTimeout(resolve, 2000) })
    Logger.log('OtherClass.asyncFunction end')
  }
}

module.exports.otherClass = new OtherClass()
