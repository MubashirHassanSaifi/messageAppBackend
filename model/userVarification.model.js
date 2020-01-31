const mongoose=require('mongoose')

const Schema=mongoose.Schema;


const userSchema= new Schema({
 userName:{
     type:String,
     required:true,
     unique:true,
     minlength:3,
     trim:true,
     match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
     index: true
    

},
password:{
type:String,
required:true,
minlength:6,
maxlength:1000
},
email:{
type:String,
required:true;
unique:true,
match: [/\S+@\S+\.\S+/, 'is invalid'],
index: true

}

},{timestamps:true});

let UserVarification=mongoose.model('UserVarification',userSchema);
module.exports=UserVarification;