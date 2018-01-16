const UserModel = require('../models/user')
const GoodsModel = require('../models/goods')
const bcrypt = require('bcrypt')
const SMSClient = require('@alicloud/sms-sdk')
const jwt = require('jsonwebtoken')
const moment = require('moment')

// 添加商品到购物车
const addCart = async(ctx, next) => {
  let { id } = ctx.request.body
  let api_token = ctx.get('Authorization').split(' ')[1]
  let person = await UserModel.findOne({api_token})
  // 取商品
  let product = await GoodsModel.findOne({_id: id})
  // 存入到shopcart中
  // 先遍历是否存在 如果存在直接productNum++
  let have = 0
  let result
  person.shopCart.find(item => {
    if (String(item._id) === id) {
      if (item.productNum < product.storeNum) {
        item.productNum++
        have = 1
      } else {
        have = 2
      }
    }
  })
  if (have === 1) {
    result = await person.save()
    ctx.body = {
      status: '0',
      msg: result
    }
  } else if (have === 0) {
    person.shopCart.push(product)
    result = await person.save()
    ctx.body = {
      status: '0',
      msg: result
    }
  } else {
    ctx.body = {
      status: '1',
      msg: '库存不足'
    }
  }
}

// 注册
const register = async(ctx, next) => {
  let { account } = ctx.request.body
  let { password } = ctx.request.body
  // 这里可以先对账号密码进行正则校验
  let reg = /\w{6,14}/
  if (reg.test(account) && reg.test(password)) {
    let result = await UserModel.findOne({account})

    if (result) {
      ctx.body = {
        status: '1',
        msg: '该账号已存在'
      }
    } else {
      // 密码加密
      await bcrypt.hash(password, 10, async(err, hash) => {
        // Store hash in your password DB.
        let user = new UserModel({
          account,
          password: hash
        })
        await user.save()
      })
      ctx.body = {
        status: '0',
        msg: '恭喜您，注册成功!'
      }
    }
  } else {
    ctx.body = {
      status: '1',
      msg: '账号密码不符合规范'
    }
  }
}

// 登录
const login = async(ctx, next) => {
  let { account } = ctx.request.body
  let { password } = ctx.request.body

  let user = await UserModel.findOne({account})

  if (user) {
    let result = await bcrypt.compare(password, user.password)
    if (result) {
      // let Random = Math.random().toString(36).substr(2)
      user.api_token = createToken(user._id)
      await user.save()
      // ctx.session.user = result
      ctx.body = {
        status: '0',
        msg: '登录成功',
        api_token: user.api_token
      }
    } else {
      ctx.body = {
        status: '1',
        msg: '登录失败'
      }
    }
  } else {
    ctx.body = {
      status: '1',
      msg: '该账号不存在'
    }
  }
}

// 鉴权
const signinRequire = async(ctx, next) => {
  const authorization = ctx.get('Authorization')
  if (!authorization) {
    ctx.throw(401, 'no token')
  }
  const token = authorization.split(' ')[1]
  let tokenContent
  try {
    tokenContent = await jwt.verify(token, 'spawn')
  } catch (e) {
    ctx.throw(401, 'invalid token')
  }
  await next()
}

// 生成token
function createToken (userId) {
  const token = jwt.sign({
    userId
  }, 'spawn', {
    expiresIn: '2h'
  })
  return token
}

// 获取验证码
const getCode = async(ctx, next) => {
  const { phone } = ctx.request.body
  const code = Math.random() * 10000 | 0
  let smsClient = new SMSClient({
    accessKeyId,
    secretAccessKey
  })
  smsClient.sendSMS({
    PhoneNumbers: phone,
    SignName: '假面猫',
    TemplateCode: 'SMS_121910780',
    TemplateParam: `{"code": ${code}}`
  })
}

// 获取购物车数据
const getCart = async(ctx, next) => {
  const token = ctx.get('Authorization').split(' ')[1]
  try {
    let person = await UserModel.findOne({api_token: token})
    ctx.body = {
      status: '0',
      result: person.shopCart
    }
  } catch (e) {
    ctx.throw(e)
  }
}

// 删除购物车中商品
const delCart = async(ctx, next) => {
  const token = ctx.get('Authorization').split(' ')[1]
  const id = ctx.request.body.id
  try {
    let result = await UserModel.update({
      'api_token': token
    }, {
      $pull: {
        'shopCart': {
          '_id': id
        }
      }
    })
    if (result) {
      ctx.body = {
        status: '0',
        msg: '删除成功'
      }
    } else {
      ctx.body = {
        status: '1',
        msg: '删除失败'
      }
    }
  } catch (e) {
    ctx.throw(e)
  }
}

// 更新购物车商品数据和单个选中状态
const editCart = async(ctx, next) => {
  const token = ctx.get('Authorization').split(' ')[1]
  const id = ctx.request.body.id
  const num = ctx.request.body.num
  const checked = ctx.request.body.checked
  try {
    let result = await UserModel.update({
      'api_token': token,
      'shopCart._id': id
    }, {
      'shopCart.$.productNum': num,
      'shopCart.$.checked': checked
    })
    if (result) {
      ctx.body = {
        status: '0',
        msg: '更新成功'
      }
    } else {
      ctx.body = {
        status: '1',
        msg: '更新失败'
      }
    }
  } catch (e) {
    ctx.throw(e)
  }
}

// 全选或全否
const editCartAll = async(ctx, next) => {
  const token = ctx.get('Authorization').split(' ')[1]
  const checkedAll = ctx.request.body.checkedAll
  try {
    let person = await UserModel.findOne({'api_token': token})
    if (person) {
      person.shopCart.forEach(item => {
        item.checked = checkedAll
      })
    }
    await person.save()
    ctx.body = {
      status: '0',
      msg: 'ok'
    }
  } catch (e) {
    ctx.throw(e)
  }
}

// 获取地址列表
const getAddress = async(ctx, next) => {
  const token = ctx.get('Authorization').split(' ')[1]
  try {
    let person = await UserModel.findOne({'api_token': token})
    if (person) {
      ctx.body = {
        status: '0',
        result: person.addressList
      }
    }
  } catch (e) {
    ctx.throw(e)
  }
}

// 添加地址
const editAddress = async(ctx, next) => {
  const token = ctx.get('Authorization').split(' ')[1]
  const form = ctx.request.body
  try {
    let person = await UserModel.findOne({'api_token': token})
    if (person) {
      person.addressList.push(form)
      await person.save()
      ctx.body = {
        status: '0',
        msg: '添加成功'
      }
    }
  } catch (e) {
    ctx.throw(e)
  }
}

// 设置默认地址
const setDefault = async(ctx, next) => {
  const token = ctx.get('Authorization').split(' ')[1]
  const { id } = ctx.request.body
  try {
    let person = await UserModel.findOne({'api_token': token})
    person.addressList.forEach(item => {
      if (item._id == id) {
        item.isDefault = true
      } else {
        item.isDefault = false
      }
    })
    await person.save()
    ctx.body = {
      status: '0',
      msg: '设置成功'
    }
  } catch (e) {
    ctx.throw(e)
  }
}

// 删除地址
const delAddress = async(ctx, next) => {
  const token = ctx.get('Authorization').split(' ')[1]
  const { id } = ctx.request.body
  try {
    await UserModel.update({
      'api_token': token
    }, {
      $pull: {
        'addressList': {
          '_id': id
        }
      }
    })
    ctx.body = {
      status: '0',
      msg: '删除成功'
    }
  } catch (e) {
    ctx.throw(e)
  }
}

// 生成订单
const createOrder = async(ctx, next) => {
  // 下单  前台需要传过来addressId
  // 先进行库存校验 然后生成订单 订单金额后台计算
  const token = ctx.get('Authorization').split(' ')[1]
  const { addressId } = ctx.request.body
  try {
    let person = await UserModel.findOne({'api_token': token})
    let flag = true
    // forEach 不行
    // await person.shopCart.forEach(async (item) => {
    //   if (item.checked) {
    //     let goods = await GoodsModel.findOne({'_id': item._id})
    //     if (goods.storeNum < item.productNum) {
    //       console.log(item.productNum)
    //       flag = false
    //     }
    //   }
    // })
    // for 循环 可以
    let orderGoods = person.shopCart.filter(item => {
      return item.checked === true
    })
    for (let i of orderGoods) {
      let goods = await GoodsModel.findOne({'_id': i._id})
      if (goods.storeNum < i.productNum) {
        flag = false
      }
    }
    // 这个场景中 map + promise 不适合
    // Promise.all(person.shopCart.map(item => {
    //   if (item.checked) {
    //     return GoodsModel.findOne({'_id': item._id})
    //   }
    // })).then(res => {
    //   res.every(x => {
    //     return x.storeNum >= item.productNum
    //   })
    // })
    if (flag) {
      // 拿到收货地址
      let orderAddress = ''
      person.addressList.forEach(item => {
        if (addressId === item._id) {
          orderAddress = item
        }
      })

      // 计算订单金额
      let orderTotal = 0
      orderGoods.forEach(item => {
        orderTotal += item.salePrice * item.productNum
      })
      orderTotal = orderTotal + 30 - 100 + 20

      // 拿到订单号
      let orderId = moment(new Date()).format('YYYYMMDDHHmmss') + ~~(Math.random() * 1000)
      let order = {
        orderId,
        orderTotal,
        orderAddress,
        orderGoods,
        orderStatus: 0
      }

      person.orderList.push(order)
      await person.save()
      ctx.body = {
        status: '0',
        result: {
          orderId,
          orderTotal
        }
      }
    } else {
      ctx.body = {
        status: '1',
        msg: '商品库存不足'
      }
    }
  } catch (e) {
    ctx.throw(e)
  }
}

// 根据订单号查询订单
const getOrderOne = async(ctx, next) => {
  const token = ctx.get('Authorization').split(' ')[1]
  const { orderId } = ctx.request.query
  console.log(orderId)
  try {
    let person = await UserModel.findOne({'api_token': token})
    if (person) {
      let result = person.orderList.filter(item => {
        return item.orderId === orderId
      })
      console.log(result)
      if (result.length > 0) {
        ctx.body = {
          status: '0',
          result: result[0]
        }
      } else {
        ctx.body = {
          status: '1',
          msg: '无该订单'
        }
      }
    }
  } catch (e) {
    ctx.throw(e)
  }
}

// 购物车商品数量
const getCartCount = async(ctx, next) => {
  const token = ctx.get('Authorization').split(' ')[1]
  try {
    let person = await UserModel.findOne({'api_token': token})
    let count = 0
    person.shopCart.forEach(item => {
      count += item.productNum
    })
    ctx.body = {
      status: '0',
      count
    }
  } catch (e) {
    ctx.throw = e
  }
}

module.exports = {
  addCart,
  register,
  login,
  signinRequire,
  getCode,
  getCart,
  delCart,
  editCart,
  editCartAll,
  getAddress,
  editAddress,
  setDefault,
  delAddress,
  createOrder,
  getOrderOne,
  getCartCount
}
