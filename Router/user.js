const router=require('express').Router();
let User =require('../model/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const check_Auth=require('./middleware/check_Auth');
const joi=require('@hapi/joi');

/*
router.route('/').post(async (req,res)=>{
 const username =req.body.username;
 const password=req.body.password;
 const email=req.body.email;
 const salt = await bcrypt.genSalt(10);
 const hashPassword=await bcrypt.hash(password,salt);
 */

 // Schema for user validation
 const signUpSchema=joi.object({
   username: joi.string().min(3).max(30).required(),
   password:joi.string().min(6).required(),
   email:joi.string().min(6).required().email()
})

const signInSchema=joi.object({
 username:joi.string().min(3).max(30).required(),
 password:joi.string().min(6).required(),
})

router.route('/').get((req,res)=>{
   User.find()
   .then(user=>res.status(200).json(user))
   .catch(err=>res.status(400).json("err",err));
});


//-----------------------------------------------User sign-up------------------------------------
 router.route('/signup').post(async (req,res)=>{
  //check validation
  
    const {error} =await signUpSchema.validateAsync(req.body);
    
    if(error){
    return res.status(400).send(error.details[0].message);
    }
 
  const username =req.body.username;
  const email=req.body.email; 
  const password=req.body.password;
    
    // validate username
     const userNameExist = await User.findOne({username:username});
     if(userNameExist){
       return res.status(400).json("username is already exist");
     }
    //validate email
    const emailExist = await User.findOne({email:email})
     if(emailExist) {
       return res.status(400).json("Email already Exist");
     }
   

//   to create some random string    bcrypt.genSaltSync(10);
   const salt=process.env.SALT;
    const hashPassword=await bcrypt.hash(password,salt);
   

const newUser = new User(
     {
         username:username,
         email:email,
         password:hashPassword
        
        }
 );
 const userSave =newUser.save();
try{
  const token  =jwt.sign({
    _id:userSave._id,
  },process.env.TOKEN);
  res.send({
    message:"User added",
    assignToken:token
  });

} 
catch(err){
  res.status(400).json(err);

}
   
 });
//--------------------------------------------------------------------------------------------------
//-----------------------------------------------------user sign-in---------------------------------
router.route('/signin').post( async (req,res,next)=>{
  
  //check validation
    const {error}=await signInSchema.validateAsync(req.body);
      if(error)
      return res.status(400).send(error.details[0].message)  
  const username  =req.body.username;
  const password  = req.body.password;
 
  const srchUser = await User.findOne({
   username: username
  });
  
if(srchUser===null)
 res.status(400).json('user not found');

try{
 const verifyPass= await bcrypt.compare(password,srchUser.password);
if(verifyPass){
 const token =jwt.sign({
   _id:srchUser._id,       //the database id 
   username:srchUser.username
  },
  process.env.TOKEN,
{
  expiresIn:"1h"
}
  
  );
 res.header('auth-token',token).send(
   {
     user:{
     id:srchUser._id,
     name:srchUser.username,
     email:srchUser.email
          },token
  });
  


 }
}
 catch(err){
 res.status(500).send(err);
 }
});

router.route('/auth').get(check_Auth , async(req,res)=>{
    
  const user = await User.findOne({_id:req.users._id});
  
  if(user){
  res.send({
    userName:user.username,
    email:user.email
  })
  }
  else 
  res.status(400).send("error");
});
  
module.exports=router;

