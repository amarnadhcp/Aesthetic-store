const mongoose = require("mongoose")

const couponschema = mongoose.Schema({

    code:{
        type:String,
        required:true,
        unique:true
        
    },
    maxdiscount:{
        type:Number,
        required:true
    },
    expirydate:{
        type:Date,
        required:true
    },
    minPurchaseAmount:{
        type:Number,
        required:true   
    },
 
    percentage:{
        type:Number,
        required:true,
        min:0,
        max:100
    },
    userused:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userdata"
    }

})


module.exports = mongoose.model("coupon",couponschema)