const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

exports.protect = async (req , res, next)=>{
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer') )
    {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if(token){
                const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY )
                req.user = await userModel.findById(decoded.id).select('-password') 
                next()
            }
            else {
                 console.log("error during user token verification 005");
               return res.status(401).json({ message: "error during user token verification 005" });
            }

        } catch (error) {
             console.log("error during user authentication 004");
             return res.status(401).json({ message: "error during user authentication 004" });
            }
    }
 else {
                 console.log("error during user token verification 016");
         return res.status(401).json({ message: "error during user token verification 016" });
      }
}
exports.IsAdmin = (req , res , next)=>
{
        if(req.user && req.user.role === 'admin'){
            next()
        }
        else {
             console.log("error during admin authorization 006");
             return res.status(403).json({ message: "error during admin authorization 006" });
        }
 }

