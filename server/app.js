const Koa = require('koa')
const PORT = process.env.PORT || 3000
const router = require('./config/route')
const mongoose = require('mongoose')
const bodyparser = require('koa-bodyparser')
const DB_URL = 'mongodb://localhost:27017/imooc'
const nunjucks = require('koa-nunjucks-2')
const path = require('path')
// const session = require('koa-session')
const app = new Koa()

mongoose.connect(DB_URL, {
  useMongoClient: true
})
mongoose.Promise = global.Promise
mongoose.connection.on('connected', () => {
  console.log('mongoose is ok!')
})

// app.keys = ['jiumozhi']

// const config = {
//   key: 'koa:sess'
// }

// app.use(session(config, app))

app.use(nunjucks({
  ext: 'html',
  path: path.join(__dirname, 'views'),
  nunjucksConfig: {
    trimBlocks: true // 开启转义 防Xss
  }
}))

app.use(bodyparser())
app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`This project is staring at ${PORT}!`)
})
