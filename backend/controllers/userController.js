const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError');
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require("crypto")
const Product = require('../models/productModel'); 
const cloudinary = require("cloudinary")


//register user
// exports.registerUser = catchAsyncError(async (req, res) => {

//     const { name, email, password } = req.body

//     const cloud = await cloudinary.v2.uploader.upload(req.files.avatar, {
//         folder: "avatars",
//         width: 150,
//         crop: "scale"
//     })
    

//     const user = await User.create({
//         name, email, password,
//         avatar: {
//             public_id:"this is public id",
//             url: "url",
//             public_id: cloud.public_id,
//             url: cloud.secure_url
//         }
//     })

//     sendToken(user, 201, res)
    
// })
exports.registerUser = catchAsyncError(async (req, res) => {
    const { name, email, password } = req.body;

    // Create user without avatar information
    const user = await User.create({ name, email, password });

    sendToken(user, 201, res);
});




//login user

exports.loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body

    //checking user have email and password already
    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email and Password", 400)) //bad req
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHandler("Invalid Credentials", 401)) // unauthorized
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Credentials", 401))
    }

    sendToken(user, 200, res)
})

//logout user

exports.logoutUser = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logout Successfully"
    })
})

//forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404))
    }

    //get reset Password token
    const resetToken = user.getResetPasswordToken();

    await user.save(({ validateBeforeSave: false }))

    //creating link to reset password
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/:${resetToken}`

    const message = `Your reset Password token is :- /n/n ${resetPasswordUrl}, /n/n if you have not
    requested this email then, Please ignore it `

    try {

        await sendEmail({
            email: user.email,
            subject: `Ecommerce`,
            text: message
        })

        res.status(200).json({
            success: true,
            message: `Email send to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save(({ validateBeforeSave: false }))

        return next(new ErrorHandler(error.message, 500))
    }
})


//reset Password

exports.resetPassword = catchAsyncError(async (req, res, next) => {

    //creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Reset Password token is invalid and has been Expired", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not Matched", 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(res, 200, user)
})


//get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

//update user password
exports.updateUserpassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is Incorrect", 400))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not Matched", 400))
    }

    user.password = req.body.newPassword

    await user.save()

    sendToken(user, 200, res)
})



//update user Profile details
//////////////
// exports.updateUserDetails = catchAsyncError(async (req, res, next) => {

//     const userNewData = {
//         name: req.body.name,
//         email: req.body.email
//     }
///////////////
    // if(req.body.avatar !== ""){

    //     const user = await User.findById(req.body.id)

    //     const imageId = user.avatar.public_id
    //     await cloudinary.v2.uploader.destroy(imageId)

    //     const cloud = await cloudinary.v2.uploader.upload(req.files.avatar.path, {
    //         folder: "avatars",
    //         width: 150,
    //         crop: "scale"
    //     })

    //     newUserData.avatar = {
    //         public_id: cloud.public_id,
    //         url: cloud.secure_url
    //     }
    // }
    ///////////////
//     const user = await User.findByIdAndUpdate(req.user.id, userNewData, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false
//     })

//     res.status(200).json({
//         success: true
//     })
// })

///////////
exports.updateUserDetails = catchAsyncError(async (req, res, next) => {
    try {
        console.log("Request Body:", req.body); // Log the request body to check its format
        const userNewData = {
            name: req.body.name,
            email: req.body.email
        }
        // ... rest of the code

        // Ensure that the response is sent properly
        res.status(200).json({
            success: true
        });
    } catch (error) {
        console.error("Error in updateUserDetails:", error);
        // Handle or send back an error response if needed
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});


//get All users by admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {

    const users = await User.find();

    if (users.length === 0) {
        return next(new ErrorHandler("No User Found", 400))
    }

    res.status(200).json({
        success: true,
        users
    })
})



//get one  user details by admin
exports.getOneUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not Exist with this ID: ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        user
    })
})


//update user Role by admin
exports.setUserRole = catchAsyncError(async (req, res, next) => {

    const userNewData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    await User.findByIdAndUpdate(req.params.id, userNewData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    // if (!user) {
    //     return next(new ErrorHandler(`No User Exist with this ID: ${req.params.id}`, 404))
    // }

    res.status(200).json({
        success: true,
        message: "User role Updated successfully"
    })
})



//Delete user by admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`No User exists with this ID: ${req.params.id}`, 404));
    }

    const imageId = user.avatar.public_id

    await cloudinary.v2.uploader.destroy(imageId)

    res.status(200).json({
        success: true,
        message: "User Deleted successfully"
    });
});


//create review and update the review
// exports.createProductReview = catchAsyncError(async (req, res, next) => {

//     const { rating, comment, productId } = req.body;


//     const review = {
//         // user: req.user._id,   
//         // name: req.user.name,
//         // email: req.user.email,
//         rating: Number(rating),
//         comment
//     };

//     // console.log(req.user._id)
//     // console.log(req.body.name)
//     // console.log(req.body.email)

//     const product = await Product.findById(productId);

//     const isReviewed = product.reviews.find(
//         (rev) => rev.user.toString() === req.user._id.toString());

//     if (isReviewed) {
//         product.reviews.forEach((rev) => {
//             if (rev.user.toString() || '' === req.user._id.toString() || '')
//                 (rev.rating = rating),
//                 (rev.comment = comment);
//         });
//     } else {
//         product.reviews.push(review);
//         product.numOfReviews = product.reviews.length;
//     }

//     let avg = 0;
//     product.reviews.forEach((rev) => {
//         avg += rev.rating;
//     });
    
//     product.ratings = avg / product.reviews.length;
    

//     await product.save({ validateBeforeSave: false });

//     res.status(200).json({
//         success: true
//     });


    // if (!req.body || !req.body._id) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'User ID not found or not authenticated'
    //     });
    // }
// });
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        rating: Number(rating),
        comment
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user && rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user && rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });
    
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});



//get all reviews of products
exports.getAllReviews = catchAsyncError(async (req, res, next) =>{

    const product = await Product.findById(req.query.id)

    if(!product){
        return next(new ErrorHandler("Product Not found" ,404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews 
    })
})



//delete review
exports.deleteReview = catchAsyncError(async (req, res, next) =>{

    const product = await Product.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler("Product Not found" ,404))
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    )

    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0
    if(reviews.length === 0){
        ratings = 0
    }
    else{
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length 

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    },{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        reviews: product.reviews 
    })
})