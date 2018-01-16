const GoodsModel = require('../models/goods')

exports.getProduct = async(ctx, next) => {
  let priceLevel = ctx.request.query.priceLevel
  let page = Number(ctx.request.query.page)
  let pageSize = Number(ctx.request.query.pageSize)
  let skip = Number((page - 1) * pageSize)
  let sort = Number(ctx.request.query.sort)
  let sortRule = sort ? {'salePrice': sort} : {}

  // 做个字典吧
  let dict = [{}, {
    'salePrice': {
      '$gte': 0,
      '$lt': 100
    }
  }, {
    'salePrice': {
      '$gte': 100,
      '$lt': 500
    }
  }, {
    'salePrice': {
      '$gte': 500,
      '$lt': 1000
    }
  }, {
    'salePrice': {
      '$gte': 1000,
      '$lt': 3000
    }
  }]

  let findRule = dict[priceLevel]
  try {
    let result = await GoodsModel.find(findRule).sort(sortRule).skip(skip).limit(pageSize)
    ctx.body = {
      status: '0',
      result
    }
  } catch (e) {
    ctx.body = {
      status: '1',
      msg: e.message
    }
  }
}
