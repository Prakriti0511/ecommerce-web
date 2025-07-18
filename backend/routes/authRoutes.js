import express from "express"
import { registration } from "../controller/authController.js"
import { login } from "../controller/authController.js"


const authRoutes = express.Router()

authRoutes.post("/registration", registration  )
authRoutes.post("/login", login)

export default authRoutes