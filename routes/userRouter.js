const express=require('express')
const userRouter=express.Router()
const userController=require('../controllers/userController')

userRouter.post('/signUp',userController.signUp)
userRouter.post('/login',userController.login)

module.exports=userRouter