import express from "express"
import { registration } from "../controllers/authController.js"
import { login } from "../controllers/authController.js"
import { logOut } from "../controllers/authController.js"
import { googleLogin } from "../controllers/authController.js"


const authRoutes = express.Router()

authRoutes.post("/registration", registration  )
authRoutes.post("/login", login)
authRoutes.get("/logout", logOut)
authRoutes.post("/googlelogin", googleLogin)

export default authRoutes