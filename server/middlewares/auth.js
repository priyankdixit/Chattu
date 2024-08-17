import jwt from "jsonwebtoken";
import {TryCatch} from "./error.js";
import {ErrorHandler} from "../utils/utility.js"




const isAuthenticated = TryCatch((req, res, next) => {
    const token = req.cookies["chattu-token"];
    if (!token)
      return next(new ErrorHandler("Please login to access this route", 401));
  
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = decodedData._id;
  
    next();
  });


const adminOnly=(req,res,next)=>{
    
    const token=req.cookies["chattu-admin-token"];
    if(!token)
        return next(new ErrorHandler("Only admin can access this route",401));
    
    const adminSecretKey=process.env.ADMIN_SECRET_KEY || "6pp";
   
    const secretKey=jwt.verify(token,process.env.JWT_SECRET);

    const isMatched=secretKey === adminSecretKey;

   
    if(!isMatched) return next(new ErrorHandler("Only admin can access this route",401))

    
    next();
}

export {isAuthenticated,adminOnly};



