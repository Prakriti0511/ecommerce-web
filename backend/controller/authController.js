import User from "../model/userModel.js"
import validator from "validator"
import bcrypt from "bcryptjs"

export const registration = async (req,res)=>{
    try {
        const {name, email, password} = req.body;
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"User already exists"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Enter valid Email"})
        }
        if(password.length < 8){
            return res.status(400).json({message:"Enter Strong Password"})
        }
        let hashPassword = await bcrypt.hash(password, 10)

        const user  = await User.create({name, email, password:hashPassword})
        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly:true,
            secure:false,
            sameSite:"Strict",
            maxAge: 7 * 24 * 0 * 60 * 1000
        })
    } catch (error) {
        console.log("SignUp error")
        return res.status(500).json({message:`Registration error ${error}`})
    }
}
export const login = async (req, res) => {
       try {
            let {email, password} = req.body;
            let user = await User.findOne({email})
            if(!user){
                return res.status(404).json({message:"User is not Found"})
            }
            let isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch){
                return res.status(404).json({message:"Incorrect password"})
            }
            let token = await genToken(user._id)
            res.cookie("token", token, {
                httpsOnly:true,
                secure:false,
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            return res.status(201).json(user)
       } catch (error) {
            console.log(error)
            res.status(500).json({message:`Login error ${error}`})
       } 
}

export const logOut = async(req, res) => {
    try{
        res.clearCookie("token")
        return res.status(200).json({message:"logOut successful"})
    }
    catch(error){
        console.log("logOut error")
        return res.status(500).json({message:`Logout error ${error}`})
    }
}

export const googleLogin = async(req, res) => {
    try{
        let {name, email} = req.body;
        let user = await User.findOne({email})
                if(!user){
                   user = await User.create({name, email})
                }
                let token = await genToken(user._id)
                res.cookie("token", token, {
                    httpsOnly:true,
                    secure:false,
                    sameSite: "Strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                return res.status(201).json(user)
        } catch (error) {
                console.log("google login error")
                res.status(500).json({message:`Google Login error ${error}`})
        } 
}