const mongoose = require('mongoose')

const addToCart = mongoose.Schema({
    userId: String,
    productId: {
        ref : 'product',
        type : String,
    },
    quantity: Number,
}, {
    timestamps : true
})

const addToCartModel = mongoose.model("addToCart", addToCart)

module.exports = addToCartModel