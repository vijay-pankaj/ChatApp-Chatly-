const express=require('express')
const msgRouter=express.Router()
const messageController=require("../controllers/message.controller")
const authMiddleware = require("../middlewares/auth.middleware");

msgRouter.get("/:userId", authMiddleware, messageController.getChat);

module.exports=msgRouter