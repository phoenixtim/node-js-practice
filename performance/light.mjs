import { monitorEventLoopDelay, performance, PerformanceObserver } from 'perf_hooks'

const observer = new PerformanceObserver((items) => {
  console.log(items.getEntries())

  performance.clearMarks()
  // @ts-ignore
  performance.clearMeasures()
  observer.disconnect()
})
observer.observe({ entryTypes: ['measure'] })

const work = index => {
  console.log(`work ${index} done`)

  performance.mark(`work-${index}`)
}

const basicTimeout = 500

const histogram = monitorEventLoopDelay()
const startMark = 'start'
performance.mark(startMark)

const promises = []
histogram.enable()
const startUtilization = performance.eventLoopUtilization()
for (let index = 0; index < 5; index++) {
  promises.push(new Promise(resolve => {
    setTimeout(() => {
      work(index)

      resolve()
    }, basicTimeout * (index + 1))
  }))
}
await Promise.all(promises)
histogram.disable()
performance.measure(`measure`, startMark)

console.log('event loop utilization', performance.eventLoopUtilization(startUtilization))
console.log('event loop delay histogram', histogram)
