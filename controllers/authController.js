const User = require('./../models/usersModel');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const AppError = require('./../utils/appError');
const catchAsynch = require('./../utils/catchAsync');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined;
    res
        .status(statusCode)
        .json({
            status: 'success',
            token,
            data: {user}
        });
}

exports.signup = catchAsynch( async (req, res)=>{
        const newUser = await User.create(req.body);        
        createSendToken(newUser, 201, res);
});

exports.login = catchAsynch( async (req, res)=>{
        const { email, password } = req.body;

        if(!email || !password){
            return next(new AppError('Please provide eamil and password!', 400));
        }

        const user = await User.findOne({email}).select('+password');
        
        if(!user || ! await user.correctPassword(password, user.password)){
            return next(new AppError('Please provide eamil and password!', 400));

        }
        createSendToken(user, 200, res);
});

