const mongoose=require("mongoose");
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,unique:true},items:[{product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},quantity:{type:Number,min:1,required:true}}]},{timestamps:true});
module.exports=mongoose.model("Cart",schema);
