const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true,minlength:2,maxlength:80},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true},
  password:{type:String,required:true,minlength:6,select:false},
  phone:{type:String,trim:true,default:""},
  role:{type:String,enum:["user","admin"],default:"user",index:true},
  isActive:{type:Boolean,default:true},
  addresses:[{label:String,fullName:String,phone:String,addressLine1:String,addressLine2:String,city:String,state:String,pincode:String,country:{type:String,default:"India"},isDefault:{type:Boolean,default:false}}]
},{timestamps:true});
module.exports = mongoose.model("User",userSchema);
