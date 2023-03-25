const mongoose =require('mongoose')

const productschema = mongoose.Schema({

   name:{
    type:String,
    required:true
   },

   image:{
    type:Array,
    required:true
   },

   category:{
    type:mongoose.Schema.Types.ObjectId,
        ref: "category",
      required:true
      
   },

   stock:{
      type:Number,
      required:true
   },

   price:{
      type:Number,
      required:true
   },
   
   description:{
     type:String,
     required:true
   },

   status:{
      type:Boolean,
      default:true
   }

})

module.exports = mongoose.model("productschema",productschema)


