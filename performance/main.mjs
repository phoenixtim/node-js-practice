/* eslint-disable no-console */

import { performance } from 'perf_hooks'

const mainUtilizationStart = performance.eventLoopUtilization()

await Promise.all([
  import('./light.mjs'),
  import('./hard.mjs'),
])

// eventLoopUtilization собирает информацию об использовании event loop всеми модулями, а не только
// тем, в котором он вызван.
console.log('main loop utilization', performance.eventLoopUtilization(mainUtilizationStart))
