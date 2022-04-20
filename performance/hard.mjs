import { monitorEventLoopDelay, performance, PerformanceObserver } from 'perf_hooks'

const observer = new PerformanceObserver((items) => {
  console.log(items.getEntries())

  performance.clearMarks()
  // @ts-ignore
  performance.clearMeasures()
  observer.disconnect()
})
observer.observe({ entryTypes: ['measure'] })

const work = async index => {
  const array = []
  for (let value = 0; value < 10000000; value++) {
    array.push(value)
  }

  console.log(`work ${index} done`)
  performance.mark(`work-${index}`)
}

const histogram = monitorEventLoopDelay()
const startMark = 'start'
performance.mark(startMark)

const promises = []
histogram.enable()
const startUtilization = performance.eventLoopUtilization()
for (let index = 0; index < 5; index++) {
  promises.push(work(index))
}
await Promise.all(promises)
histogram.disable()
performance.measure(`measure`, startMark)

console.log('event loop utilization', performance.eventLoopUtilization(startUtilization))
console.log('event loop delay histogram', histogram)
