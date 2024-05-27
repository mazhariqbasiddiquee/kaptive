
var jwt = require('jsonwebtoken');
require("dotenv").config()
const auth=(req,res,next)=>{
     try{

      if (!req.headers.authorization) {
         return res.status(401).json({ msg: "please provide token to access" });
       }
      let token=req.headers.authorization.split(" ")[1]
    jwt.verify(token, process.env.privateKey, function(err, decoded) {
         if(decoded){
            req.body.UserId=decoded.userId
            next()
         }
         else{
            res.status(401).json({msg:err.message})
         }
      });

     }
     catch(err){
      res.status(500).json({msg:err.message})
     }
     
}

module.exports={auth}