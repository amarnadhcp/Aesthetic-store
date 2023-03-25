const mongoose = require('mongoose')
const { Number } = require('twilio/lib/twiml/VoiceResponse')

const userschema = mongoose.Schema({

   firstname: {
      type: String,
      require: true
   },

   lastname: {
      type: String,
      require: true
   },

   username: {
      type: String,
      require: true
   },

   mobilenumber: {
      type: Number,
      require: true
   },

   email: {
      type: String,
      require: true
   },

   password: {
      type: String,
      require: true
   },

   status: {
      type: Boolean,
      default: true
   },


   address: [
      {
       
         housename: {
            type: String,
            required: true
         },
         street: {
            type: String,
            required: true
         },
         district: {
            type: String,
            required: true
         },
         state: {
            type: String,
            required: true
         },
         pincode: {
            type: Number,
            required: true
         },
         country: {
            type: String,
            required: true
         },
         phone: {
            type: Number,
            required: true
         },

      }
   ],



   wishlist: [{
      product: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "productschema",
         required: true
      }
   }],



   cart: [{
      product: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "productschema",
         required: true
      },
      quantity: {
         type: Number,
         default: 1
      },
      prdtotalprice: {
         type: Number,

      },


   }],

   wallet:{
      type:Number,
      default:0

   },

   carttotalprice: {
      type: Number

   }


})

module.exports = mongoose.model('userdata', userschema)