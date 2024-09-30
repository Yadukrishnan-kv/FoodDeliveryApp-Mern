const {Schema,model}=require("mongoose")
const mongoose = require('mongoose')
const orderSchema=new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  address: {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      name:{type:String,required:true}
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });
const orderCollection=model("orders",orderSchema)
module.exports=orderCollection