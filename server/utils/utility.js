class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }

  const userSocketIDs=new Map();  //userSocketIDs I have kept in utility folder as there was circular dependency refernce error coming by keeping it here 
  
  export { ErrorHandler,userSocketIDs };