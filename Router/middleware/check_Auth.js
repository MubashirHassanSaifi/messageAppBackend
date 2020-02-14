const jwt =require('jsonwebtoken');

module.exports= function (req,res,next){
const authHeader= req.headers['authorization'];
const token  =authHeader && authHeader.split(' ')[1];
//const token=req.headers.auth;
console.log(token);
if(!token) {
return res.status(401).json("token not found")
} 
try {
  const verified = jwt.verify(token, process.env.TOKEN);
   req.users=verified;
  console.log(req.users._id);
  next();
}
catch (err) {
  return res.status(400).send({
      'message' : 'Invalid token'
  });
}

}