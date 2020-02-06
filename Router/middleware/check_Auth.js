const jwt =require('jsonwebtoken');

module.exports= async (req,res,next)=>{
    const authHeader= req.headers['authorization'];
const token  =authHeader && authHeader.split(' ')[1];
console.log(`token:${token}`);
 await jwt.verify(token,process.env.TOKEN,(err,user)=>{
     if(err) return res.status(403).json("access denied")
   req.user=user
   console.log(req.user._id)
     next();
 })
 }