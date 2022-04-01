const express = require("express");
const {addUser, loginUser, verifyRefresh} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post('/register', addUser)
    .post('/login', loginUser)
    .post('/verify', verifyRefresh);

module.exports = userRouter;