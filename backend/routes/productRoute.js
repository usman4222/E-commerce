const express = require('express')
const { getAllProducts, createProduct, updateProduct,deleteProduct, getAllProductDetails, getAdminProducts } = require('../controllers/productConroller')
const { isAuthenticatedUser, authorizeRole } = require('../middleware/Auth')
const { createProductReview, getAllReviews, deleteReview } = require('../controllers/userController')

const router = express.Router()

router.route('/products').get(getAllProducts)
router.route('/admin/products').get(isAuthenticatedUser, authorizeRole("admin"), getAdminProducts)
router.route('/admin/product/new').post(isAuthenticatedUser,  authorizeRole("admin"), createProduct)
router.route('/admin/product/:id').put(isAuthenticatedUser,  authorizeRole("admin"), updateProduct)
router.route('/admin/product/:id').delete(isAuthenticatedUser,  authorizeRole("admin"), deleteProduct)
router.route('/product/:id').get(getAllProductDetails)
router.route('/review/').put(createProductReview, isAuthenticatedUser)
router.route('/reviews').get(getAllReviews).delete(deleteReview, isAuthenticatedUser)

module.exports =  router