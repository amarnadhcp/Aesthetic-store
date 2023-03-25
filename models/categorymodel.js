const mongoose=require('mongoose')
const categoryschema = mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

module.exports= mongoose.model('category',categoryschema)