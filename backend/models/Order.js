const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},
 items:[{product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},name:String,image:String,quantity:{type:Number,min:1,required:true},price:{type:Number,min:0,required:true}}],
 subtotal:{type:Number,required:true,min:0},shipping:{type:Number,default:0,min:0},discount:{type:Number,default:0,min:0},totalAmount:{type:Number,required:true,min:0},
 shippingAddress:{fullName:String,phone:String,addressLine1:String,addressLine2:String,city:String,state:String,pincode:String,country:String},
 paymentMethod:{type:String,enum:["COD","ONLINE"],default:"COD"},paymentStatus:{type:String,enum:["Pending","Paid","Failed","Refunded"],default:"Pending"},
 status:{type:String,enum:["Pending","Processing","Shipped","Delivered","Cancelled"],default:"Pending",index:true},cancelledAt:Date
},{timestamps:true});
module.exports=mongoose.model("Order",schema);
