const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {

    const message = `Invalid ${err.path}: ${err.value}`

    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    // use regular expression for show value
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value`;

    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const error = Object.values(err.errors).map(el => el.message);

    const message = `Invalid Input Data: ${error.join('. ')}`;

    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    //oprational, trusted error: send message to client

    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    // lrogramming or other unknown error: don't leak error details
    }else{
        // 1 log error
        console.error('ERROR', err);
        // 2 send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        });  
    }
} 
 
module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
    
    if(process.env.NODE_ENV === 'development'){
         sendErrorDev(err, res)
    } else if(process.env.NODE_ENV === 'production'){
        // let error = {...err};
        if (err.name === 'CastError'){
            error=handleCastErrorDB(err);  
            sendErrorProd(error, res)
        } else if(err.code === 11000){
            error=handleDuplicateFieldsDB(err);  
            sendErrorProd(error, res)
        } else if(err.name === 'ValidationError'){
            error=handleValidationErrorDB(err);  
            sendErrorProd(error, res)
        } else {
            sendErrorProd(err, res)
        }
    }
};