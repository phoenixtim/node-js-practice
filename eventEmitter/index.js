const { Worker } = require('./emitter')

async function run() {
  const worker = new Worker()

  const results = await Promise.all([
    worker.doWork('some data 1'),
    worker.doWork('some data 2'),
  ])
  console.log('results', results)
  try {
    await worker.doWork('throw error')
  } catch (err) {
    console.log('error occurred', err)
  }
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
