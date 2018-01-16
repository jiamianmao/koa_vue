const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
  'productName': String,
  'salePrice': Number,
  'productImage': String,
  'storeNum': Number
})

module.exports = mongoose.model('Good', productSchema)
