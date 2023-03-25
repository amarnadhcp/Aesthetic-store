const mongoose = require("mongoose");

const adminschema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

});


module.exports = mongoose.model('admin',adminschema)