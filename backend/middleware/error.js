const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //wrong mongodb cast error
    if (err.name === "CastError") {
        const message = `Resourse Not Found, Invalid ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    //mongo duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`

        err = new ErrorHandler(message, 400)
    }


    //wrong webToken Error 
    if (err.name === "jsonWebTokenError") {
        const message = `Json Web Token is Invalid, Try again`
        err = new ErrorHandler(message, 400)
    }


    //jwt expire error
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, Try again`
        err = new ErrorHandler(message, 400)
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.stack  //stack for all if you want
    });
};
