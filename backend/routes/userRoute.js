const express = require('express')
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updateUserpassword,
    updateUserDetails,
    getAllUsers,
    getOneUser,
    setUserRole,
    deleteUser
} = require('../controllers/userController')
const router = express.Router()
const { isAuthenticatedUser, authorizeRole } = require('../middleware/Auth')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/me').get(isAuthenticatedUser, getUserDetails)
router.route('/password/update').put(isAuthenticatedUser, updateUserpassword)
router.route('/me/update').put(isAuthenticatedUser, updateUserDetails)
router.route('/admin/users').get(isAuthenticatedUser, getAllUsers, authorizeRole("admin"))
router.route('/admin/user/:id').get(isAuthenticatedUser, getOneUser, authorizeRole("admin"))
router.route('/admin/user/:id').put(isAuthenticatedUser, setUserRole, authorizeRole("admin"))
router.route('/admin/user/:id').delete(isAuthenticatedUser, deleteUser, authorizeRole("admin"))

module.exports = router