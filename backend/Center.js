const mongoose=require('mongoose');
const CenterSchema= new mongoose.Schema({
    name:String,
    email:String,
    address:String,
    phonenumber:String,
    password:String
}

);

module.exports=mongoose.model("center",CenterSchema);