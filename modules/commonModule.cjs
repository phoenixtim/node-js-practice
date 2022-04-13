/* eslint-disable no-console */

console.log('common module start')

function commonFunc() {
  console.log('commonFunc run')
}

module.exports.commonFunc = commonFunc

async function commonAsyncFunc() {
  console.log('commonAsyncFunc run')

  const secondEsModuleExport = await import('./esModule.js')

  return secondEsModuleExport
}

module.exports.commonAsyncFunc = commonAsyncFunc
