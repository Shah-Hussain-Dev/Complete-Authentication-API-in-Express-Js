import express from 'express'
import UserController from '../controllers/UserController.js'
import checkAuth from '../middleware/auth-middleware.js'
const router= express.Router()
// Route lever middleware 
router.use('/changepassword',checkAuth)
router.use('/loggeduser',checkAuth)
//get all the user 
//Public Routes
router.post('/register',UserController.userRegistration)
router.post('/login',UserController.userLogin)
router.post('/send-password-reset',UserController.userPasswordResetEmailSend)
router.post('/reset-password/:id/:token',UserController.userPasswordReset)

//Protected Routes
router.post('/changepassword',UserController.changePassword )
router.get('/loggeduser',UserController.loggedUser )
export default router

