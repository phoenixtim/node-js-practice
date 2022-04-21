/* eslint-disable no-console */

import { monitorEventLoopDelay, performance, PerformanceObserver } from 'perf_hooks'

const startMarkName = 'start-hard'
const measureName = 'measure-hard'
// Этот коллбэк ловит события из всех модулей. Поэтому, для адекватной работы, при вызове из main,
// нужна фильтрация по имени.
const observer = new PerformanceObserver(items => {
  const measure = items.getEntries()[0]
  if (!measure || measure.name !== measureName) return

  console.log(measure)

  // clearMarks и clearMeasures тоже работают на метки, созданные во всех модулях.
  performance.clearMarks(startMarkName)
  // @ts-ignore
  performance.clearMeasures(measureName)
  observer.disconnect()
})
observer.observe({ entryTypes: ['measure'] })

const work = async index => {
  const array = []
  for (let value = 0; value < 10000000; value++) {
    array.push(value)
  }

  console.log(`work ${index} done`)
}

const histogram = monitorEventLoopDelay()
performance.mark(startMarkName)

const promises = []
histogram.enable()
const startUtilization = performance.eventLoopUtilization()
for (let index = 0; index < 5; index++) {
  promises.push(work(index))
}
await Promise.all(promises)
histogram.disable()
performance.measure(measureName, startMarkName)

console.log('event loop utilization hard', performance.eventLoopUtilization(startUtilization))
console.log('event loop delay histogram hard', histogram)
