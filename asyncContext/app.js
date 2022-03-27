const { randomBytes } = require('crypto')
const Koa = require('koa')

const { asyncStorage, defaultStore } = require('./asyncStorage')
const { Logger } = require('./logging')
const { otherClass } = require('./otherModule')

const app = new Koa()

const loggingMiddleware = async (ctx, next) => {
  const requestId = randomBytes(16).toString('hex')
  await asyncStorage.run({ ...defaultStore, requestId }, () => {
    ctx.state.storage = asyncStorage

    return next()
  })
}

app.use(loggingMiddleware)

app.use(async ctx => {
  Logger.log('request handler started')

  otherClass.otherFunction()

  // We do not wait for async function result. But it will receive the same store.
  otherClass.asyncFunction()

  Logger.log('request handler final log')

  ctx.body = 'Hello'
})

app.listen(3000, 'localhost', () => {
  // eslint-disable-next-line no-console
  console.log(`service started at http://localhost:3000`)
})
