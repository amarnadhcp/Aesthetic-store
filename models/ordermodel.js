const mongoose = require('mongoose')
const {v4:uuidv4}=require("uuid")

const orderschema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userdata",
        required: true
    },
    orderId: {
        type: String,
        unique: true,
        required: true,
        // default:`oderId_${uuidv4()}`,
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        
    },
    product: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "productschema",
            required: true
        },
         quantity: {
            type: Number,
            required: true
        },
        singleTotal: {
            type: Number,
            required: true
        },
        sprice: {
            type: Number,
            required: true
        }
    }],

    total:{
        type:Number
    },
    discount:{
        type:Number,
        default:0
    },
    payementType:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"pending"
    }
})


module.exports = mongoose.model('order',orderschema)