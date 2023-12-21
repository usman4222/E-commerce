const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apifeatures');
const cloudinary = require('cloudinary')

//create product admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
    try {
        // let images = [];

        // if (typeof req.body.images === "string") {
        //     images.push(req.body.images);
        // } else {
        //     images = req.body.images;
        // }


        // for (let i = 0; i < images.length; i++) {
        //     const result = await cloudinary.v2.uploader.upload(images[i], {
        //         folder: "products"
        //     });
        //     imagesLink.push({
        //         public_id: result.public_id,
        //         url: result.secure_url
        //     });
        // }

        // req.body.images = imagesLink;
        req.body.user = req.user.id;

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});



//get all product
exports.getAllProducts = catchAsyncError(async (req, res) => {

    // return next(new ErrorHandler("This is error", 500))

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments()

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()   
        .pagination(resultPerPage )
    // let products = await apiFeature.query

    // let filteredProductsCount = products.length
    // apiFeature.pagination(resultPerPage)

    const products = await apiFeature.query

    res.status(201).json({
        success: true,
        products,
        productsCount,
        message: "Route is working fine",
        resultPerPage,
        // filteredProductsCount
    })

})

//get all product(Admin)
exports.getAdminProducts = catchAsyncError(async (req, res) => {

    const products = await Product.find()

    res.status(201).json({
        success: true,
        products,
    })

})


//get product Details
exports.getAllProductDetails = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product Not found", 404));
    }


    res.status(200).json({
        success: true,
        product
    })

})

//update product

exports.updateProduct = catchAsyncError(async (req, res, next) => {

    let product = Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product Not found", 404));
    }

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {

        if (product.images && product.images.length > 0) {
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }
        }
    }



    const imagesLink = [];

    // for (let i = 0; i < images.length; i++) {
    //     const result = await cloudinary.v2.uploader.upload(images[i], {
    //         folder: "products"
    //     });
    //     imagesLink.push({
    //         public_id: result.public_id,
    //         url: result.secure_url
    //     });

    //     req.body.images = imagesLink
    // }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})

//delete Product

exports.deleteProduct = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.params.id)


    if (!product) {
        return next(new ErrorHandler("Product Not found", 404));
    }

    if (product.images && product.images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }
    }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })
})


