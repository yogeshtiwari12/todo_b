import jwt from "jsonwebtoken";
import User from "../model/model.js";
const jwtkey = "abcdefghijkdadaafbfasfsfjaf";
export const verifytoken  = async(req,res,next)=>{
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(403).json({error: "No token found"})
        }
       const decoded =  jwt.verify(token,jwtkey);
    
       
       const user = await User.findById(decoded.id)
       if(!user){
        return res.status(404).json({error: "User not found"})
       }
       req.user = user
       next();
        
    } catch (error) {
        res.status(401).json({error: 'Token is not vali'});
        
    }

}

export const isadmin = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req?.user?.role)){
            return res.status(403).json({error: "Not authorized to access this route"})
        }
        next();
    }
}