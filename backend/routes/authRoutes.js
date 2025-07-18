import express from "express"
import { registration } from "../controller/authController.js"
import { login } from "../controller/authController.js"
import { logOut } from "../controller/authController.js"
import { googleLogin } from "../controller/authController.js"


const authRoutes = express.Router()

authRoutes.post("/registration", registration  )
authRoutes.post("/login", login)
authRoutes.get("/logout", logOut)
authRoutes.post("/googlelogin", googleLogin)

export default authRoutes