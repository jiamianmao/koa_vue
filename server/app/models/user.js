const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema
const UserSchema = new Schema({
  'account': {
    type: String,
    unique: true
  },
  'password': String,
  'orderList': Array,
  'api_token': {
    type: String,
    unique: true
  },
  'shopCart': [{
    'productName': String,
    'salePrice': Number,
    'productImage': String,
    'productNum': {
      type: Number,
      default: 1
    },
    'checked': {
      type: Boolean,
      default: true
    }
  }],
  'addressList': [{
    'postCode': Number,
    'userName': String,
    'address': String,
    'tel': Number,
    'isDefault': {
      type: Boolean,
      default: false
    }
  }],
  'orderList': [{
    'orderId': String,
    'orderTotal': Number,
    'orderAddress': String,
    'orderGoods': Array,
    'orderStatus': Number,
    'orderDate': {
      type: String,
      default: moment().format('YYYY-MM-DD HH:mm:ss')
    }
  }]
})

module.exports = mongoose.model('User', UserSchema)
