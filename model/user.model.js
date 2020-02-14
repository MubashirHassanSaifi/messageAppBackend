const mongoose=require('mongoose')
const uniqueValidator=require('mongoose-unique-validator');


const Schema=mongoose.Schema;


const userSchema= new Schema(useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true{
 username:{
     type:String,
     required:[true,'An username is required'],
     unique:true,
     minlength:3,
     trim:true,
     match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
     index: true
    

},
email:{
    type:String,
    required:[true,'An email address is required'],
    unique:true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
    },
password:{
type:String,
required:[true,'A password is required'],
minlength:6
}


},{timestamps:true});
userSchema.plugin(uniqueValidator,{message:"is already taken try a different"});
let User=mongoose.model('User',userSchema);
module.exports=User;