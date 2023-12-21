const express = require('express')
const { isAuthenticatedUser, authorizeRole } = require('../middleware/Auth')
const { newOrder, getSingleOrders, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController')
const router = express.Router()


router.route('/order/new').post(isAuthenticatedUser, newOrder)
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrders)
router.route('/orders/me').get(isAuthenticatedUser,  myOrders)
router.route('/admin/orders').get(isAuthenticatedUser, getAllOrders, authorizeRole("admin"))
router.route('/admin/order/:id').put(isAuthenticatedUser, updateOrder, authorizeRole("admin"))
router.route('/admin/order/:id').delete(isAuthenticatedUser, deleteOrder, authorizeRole("admin"))


module.exports = router