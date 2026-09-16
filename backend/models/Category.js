const mongoose = require("mongoose");
const schema = new mongoose.Schema({name:{type:String,required:true,trim:true,unique:true},slug:{type:String,required:true,unique:true,index:true},description:{type:String,default:""},image:{type:String,default:""},isActive:{type:Boolean,default:true}},{timestamps:true});
module.exports = mongoose.model("Category",schema);
