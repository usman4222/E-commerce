const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('./catchAsyncError');
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')


exports.isAuthenticatedUser = catchAsyncError( async(req, res, next) =>{

    const {token} = req.cookies
    
    if(!token){
        return next(new ErrorHandler("Please Login to access this resourse."))
    }
    const isDecoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(isDecoded.id)
    next();

})

//authorize Roles

exports.authorizeRole = (...roles) => {

    return(req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} not allowed to access this Resourse.`, 403))
        }
        next();
    }
}