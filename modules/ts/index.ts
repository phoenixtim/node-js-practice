/* eslint-disable no-console */

import { secondEsFunc, a } from './file.js'
// ESLint не знает ключевого слова assert в выражении import. Говорят, узнает, когда оно в stage 4
// перейдёт. Но и в Node.js это пока экспериментальная фишка, хотя и без дополнительных флагов.
import testJson from './test.json' assert { type: 'json' }

console.log('ES module start')

export async function esAsyncFunc() {
  console.log('esAsyncFunc run')
  console.log('testJson', testJson)
}

await esAsyncFunc()

console.log(a, secondEsFunc())
