const express=require('express')
const userRouter=express.Router();
const userController=require("../controllers/user.controller");
userRouter.get('/getusers',userController.getAllUsers);
module.exports=userRouter;