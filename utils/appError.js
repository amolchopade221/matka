class AppError extends Error{
    constructor(message, statusCode){
        super(message); //it use to call parrent constructor built in constructor only accept message

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // all created error by using this call are optional error
        this.isOperational = true; // later we can test this property, then it only return operational error. by using this class
      
        Error.captureStackTrace(this, this.constructor);
        // 
    }
}
module.exports = AppError; 