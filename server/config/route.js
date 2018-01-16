const Router = require('koa-router')
const Product = require('../app/controllers/product')
const User = require('../app/controllers/user')
// 图片
const multer = require('koa-multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split('.')
    cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})
const upload = multer({
  storage
})

const api = new Router()
const router = new Router()

// 图片
api.get('/upload', async(ctx) => {
  await ctx.render('index')
})
api.post('/upload', upload.single('file'), async(ctx, next) => {
  ctx.body = {
    filename: ctx.req.file
  }
})

// 商品
api.get('/goods', Product.getProduct)

// 用户相关
api.post('/add', User.signinRequire, User.addCart)
api.post('/register', User.register)
api.post('/login', User.login)
api.get('/getCart', User.getCart)
api.post('/delCart', User.delCart)
api.post('/editCart', User.editCart)
api.post('/editCartAll', User.editCartAll)
api.get('/getAddress', User.getAddress)
api.post('/editAddress', User.editAddress)
api.post('/setDefault', User.setDefault)
api.post('/delAddress', User.delAddress)
api.post('/createOrder', User.createOrder)
api.get('/getOrderOne', User.getOrderOne)
api.get('/getCartCount', User.getCartCount)

api.post('/getCode', User.getCode)

router.use('/api', api.routes(), api.allowedMethods())

module.exports = router
