const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuthenticated = catchAsyncError(async(req,res,next) => {
    const {token} = req.cookies;

    // if(!token){
    //     return next(new ErrorHandler("Por favor, inicia sesión para continuar", 401));
    // }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
});

exports.isAdmin = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} no puedes acceder a estos recursos!`))
        };
        next();
    }
}