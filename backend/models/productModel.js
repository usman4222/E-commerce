const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter the Product Name..."]
    },
    description: {
        type: String,
        required: [true, "Please Enter the Product Description..."]
    },
    price: {
        type: Number,
        required: [true, "Please Enter the Product Price..."],
        max: [99999999, "Price cannot exceed more than 8 characters"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    image: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter the Product Category"]
    },
    stock: {
        type: Number,
        required: [true, "Please Enter the Stock of Product"],
        max: [999999, "Stock cannot exceed more than 6 characters"],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", productSchema);
