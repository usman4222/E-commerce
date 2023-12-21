const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const bodyParser = require("body-parser")

// Load environment variables
dotenv.config({ path: "backend/config/config.env" });

// Middleware setup
app.use(cors());
app.use(express.json()); // Use express.json() instead of bodyParser.json()
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload());


// Routes
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/PaymentRoute');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
