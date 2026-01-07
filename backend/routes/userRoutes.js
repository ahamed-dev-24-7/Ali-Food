import express from "express"
import isAuth from "../middleware/auth.js"
import { getCurrentUser, updateUserLocation } from "../controller/userController.js"

const userRouter = express.Router()

 

userRouter.get("/currentuser", isAuth, getCurrentUser)
userRouter.post("/update-location", isAuth, updateUserLocation)


export default userRouter 