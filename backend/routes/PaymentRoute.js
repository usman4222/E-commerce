const express = require('express');
const router = express.Router();
const { isAuthenticateduser } = require("../middleware/Auth");
const { processPayment, sendStripeApiKey } = require('../controllers/PaymenControler');

// router.post('/payment/process', isAuthenticateduser, processPayment);
// router.get('/stripeapikey', isAuthenticateduser, sendStripeApiKey)




router.post('/payment/process', function(){
  isAuthenticateduser, processPayment
});

router.get('/stripeapikey', function(){
  isAuthenticateduser, sendStripeApiKey
});

// router.post('/payment/process').post(isAuthenticateduser, processPayment)
// router.post('/stripeapikey').get(isAuthenticateduser, sendStripeApiKey)

module.exports = router;
