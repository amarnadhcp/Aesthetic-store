const mongoose=require('mongoose')

const bannermodel =mongoose.Schema({

  description:{
     type:String,
     required:true
   },
    bannerimg:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("banner", bannermodel)

