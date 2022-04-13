/* eslint-disable no-console */

import { commonFunc, commonAsyncFunc } from './commonModule.cjs'
// ESLint не знает ключевого слова assert в выражении import. Говорят, узнает, когда оно в stage 4
// перейдёт. Но и в Node.js это пока экспериментальная фишка, хотя и без дополнительных флагов.
import testJson from './test.json' assert { type: 'json' }

console.log('ES module start')

export async function esAsyncFunc() {
  console.log('esAsyncFunc run')
  console.log('testJson', testJson)
}

await esAsyncFunc()

export function esFunc() {
  console.log('esFunc run')

  commonFunc()
}

esFunc()

const { secondEsFunc, a } = await commonAsyncFunc()
console.log(a, secondEsFunc())
