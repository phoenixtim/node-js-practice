const { randomUUID, randomBytes } = require('crypto')
const { EventEmitter, captureRejectionSymbol } = require('events')
const { promisify } = require('util')

const randomBytesAsync = promisify(randomBytes)

class Worker extends EventEmitter {
  constructor() {
    super({ captureRejections: true })

    /**
     * @type {{
     *  [workId: symbol]: {
     *    data: string,
     *    result: Buffer,
     *    resolve: Function,
     *    reject: Function,
     *  },
     * }}
     */
    this.works = {}
    this.workDataEvent = Symbol('work data')
    this.workCompletedEvent = Symbol('work completed')

    this.on(this.workDataEvent, this.#handleWorkData)
    this.on(this.workCompletedEvent, this.#handleWorkComplete)
    this.on('error', this.#handleError)
  }

  [captureRejectionSymbol](err, event, ...args) {
    switch (event) {
      case this.workDataEvent:
        console.error(`Error in Worker was handled by captureRejectionSymbol handler`, err)
        this.works[args[0]].reject(err)
        break
      default:
        console.error(
          `Error occurred in Worker while handling ${event} with args:`,
          ...args,
          '.',
          err,
        )
        break
    }
  }

  /**
   * Doing some async work and returns result.
   * @param {string} data
   */
  async doWork(data) {
    const workId = randomUUID()
    let resolve = (value) => {}
    let reject = () => {}
    const result = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
    this.works[workId] = {
      data,
      result: null,
      resolve,
      reject,
    }

    let resultTimes = 3
    // TODO: это надо было бы написать немного по другому: новый интервал не должен запускаться,
    // если произошла ошибка. Тогда был бы более правильный поток данных для EventEmitter.
    const interval = setInterval(async () => {
      // if (data === 'throw error') {
      //   // Эта ошибка не обработалась бы с помощью captureRejectionSymbol.
      //   // А у обработчика on error нет информации, из какого места пришла ошибка.
      //   this.emit('error', new Error('No! It is error!'))
      //   // Такое тоже не сработает.
      //   this.emit(captureRejectionSymbol, new Error('No! It is error!'), this.workDataEvent, workId)
      //   clearInterval(interval)
      //   return
      // }

      const workData = await randomBytesAsync(16)
      this.emit(this.workDataEvent, workId, workData)

      resultTimes -= 1
      if (resultTimes === 0) {
        clearInterval(interval)
        setImmediate(() => {
          this.emit(this.workCompletedEvent, workId)
        })
      }
    }, 500)

    console.log(`Worker started work ${workId} with data ${data}`)

    return result
  }

  async #handleWorkData(workId, data) {
    const currentWork = this.works[workId]
    if (!currentWork) {
      console.error(`Worker: work ${workId} not found`)
      return
    }

    // эта ошибка обработается с помощью captureRejectionSymbol
    if (currentWork.data === 'throw error') {
      throw new Error('No! It is error!')
    }

    currentWork.result = currentWork.result instanceof Buffer ?
      Buffer.concat([currentWork.result, data]) :
      data
  }

  async #handleWorkComplete(workId) {
    const currentWork = this.works[workId]
    if (!currentWork) {
      console.error(`Worker: work ${workId} not found`)
      return
    }

    console.log(`Worker completed work ${workId}`)

    currentWork.resolve(currentWork.result)

    delete this.works[workId]
  }

  #handleError(err) {
    console.error('Error occurred in Worker', err)
  }
}

module.exports.Worker = Worker
