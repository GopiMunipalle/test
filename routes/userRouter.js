const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const middleware = require("../middlewares/userMiddleware");

userRouter.post("/signUp", userController.signUp);
userRouter.post("/login", userController.login);
userRouter.get("/getLoginUser", middleware, userController.getLoginUser);

module.exports = userRouter;
