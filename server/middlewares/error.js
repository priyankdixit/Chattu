

const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message || "Internal Server Error";
    err.statusCode||=500;
    
    if(err.code===11000){ //duplicate key error(sduplicate username whic is unique attribute in mocels)
      const error=Object.keys(err.keyPattern).join(",")
      err.message=`Duplicate field - ${error}`;
    err.statusCode=400;
    
    }
    
   if(err.name ==="CastError"){
    const errorPath=err.path;
     err.message=`Invalid Format of ${errorPath}`;
     err.statusCode=400;
   } 
   

    return res.status(err.statusCode).json({
        success:false,
        message:process.env.NODE_ENV==="DEVELOPMENT"?err: err.message,
    })
};  // express knows its error middleware because of 4th parameter as errMiddleware Functions: Defined in the order they are executed.
//Regular Middleware: Takes req, res, next as parameters.
//Error-Handling Middleware: Takes err, req, res, next as parameters.
//Error Propagation: When next(err) is called, Express will find the next error-handling middleware in the stack and execute it.

const TryCatch = (passedFunc) => async (req, res, next) => {
    try {
      await passedFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };


export {errorMiddleware,TryCatch}