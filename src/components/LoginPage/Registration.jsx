import React, { useState } from 'react'
import { signInWithPopup } from "firebase/auth"
import { useNavigate } from 'react-router-dom'
import { IoEyeOutline } from "react-icons/io5";
import { FiEyeOff } from "react-icons/fi";



function Registration() {
    let [show,setShow] = useState(false)
    let navigate = useNavigate()
    return (
    <div className = 'w-[100%] h-[100vw] bg-gradient-to-l from-[#898AC4] to-[#C0C9EE] text-[white] flex flex-col gap-[10px] font-gill'>
        <div className = 'w-[100%] h-[100px] flex flex-col items-center justify-center'>
            <span className='text-[25px] font-semibold pb-[10px] font-gill'>Registration Page</span>
            <span className = 'text-[16px] font-semibold'>Welcome to Lush!</span>
        </div>
        <div className = 'max-w-[600px] w-[90%] h-[500px] bg-[#FFF2E0] rounded-[10px] border border-white backdrop-blur-2xl shadow-lg flex items-center justify-center mx-auto'>
            <form action="" className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
                <div className = 'w-[90%] h-[50px] bg-[#898AC4] text-[black] border-2 border-[#] rounded-[10px] shadow-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer'>
                    <img src = "google.png" alt="/Image/" className='w-[20px] rounded-[10px]'/> Signup with Google
                </div>
                <div className='w-[100%] h-[20px] flex items-center justify-center gap-[10px]'>
                    <div className='w-[40%] h-[1px] bg-[#898AC4]'></div> OR <div className='w-[40%] h-[1px] bg-[#898AC4]'></div>
                </div>
                <div className = 'w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative'>
                    <input type = "text" className = 'w-[80%] h-[50px] border-[2px] border-[#C0C9EE] backdrop:blur-sm rounded-[10px] shadow-lg bg-transparent placeholder-[#] px-[20px] font-semibold' placeholder = 'UserName' required/>
                    <input type = "text" className = 'w-[80%] h-[50px] border-[2px] border-[#C0C9EE] backdrop:blur-sm rounded-[10px] shadow-lg bg-transparent placeholder-[#] px-[20px] font-semibold' placeholder = 'Email' required/>
                    <input 
                    type={show ? "text" : "password"} 
                    className='w-[80%] h-[50px] border-[2px] border-[#C0C9EE] backdrop:blur-sm rounded-[10px] shadow-lg bg-transparent placeholder-[#] px-[20px] font-semibold' 
                    placeholder='Password' 
                    required 
                    />
                    {!show && <IoEyeOutline className='w-[20px] h-[20px] pb-[6px] text-[#898AC4] cursor-pointer absolute right-[10%]' onClick={()=>setShow(prev => !prev)}/>}
                    {show && <FiEyeOff className='w-[20px] h-[20px] pb-[6px] text-[#898AC4] cursor-pointer absolute right-[10%]' onClick={()=>setShow(prev => !prev)}/>}
                    <button className='w-[100%] h-[50px] bg-[white] rounded-[10px] flex items-center justify-center mt-[20px] text-[17px] text-gray-800 font-semibold'> Create Account </button>
                    <p className='flex gap-[10px]'>You have any account? <span className='text-[#] text-[17px] font-semibold cursor-pointer' onClick={()=>navigate("/login")}>Login</span></p>                    
                </div>
            </form>
        </div>
    </div>
  )
}

export default Registration

export const googleSignup = async() => {
    try {
        const response = await signInWithPopup(auth, provider)
        console.log(response)
        let user = response.user;
        let name = user.displayName;
        let email = user.email;
        
        const result = await axios.post(serverUrl + "/api/auth/googlelogin", {name, email}, {withCredentials:true})
        console.log(result.data)
    } catch (error) {
        console.log(error)
    }
}