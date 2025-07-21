import React from 'react'
import { signInWithPopup } from "firebase/auth"
import { useNavigate } from 'react-router-dom'

function Registration() {

    let navigate = useNavigate()
  return (
    <div className = "w-[100%] h-[100vw] bg-gradient-to-l from-[#898AC4] to-[#C0C9EE] text-[white] flex flex-col gap-[10px] font-gill">
        <div className = "w-[100%] h-[100px] flex flex-col items-center justify-center  ">
            <span className = "text-[25px] font-semibold pb-6 font-">Registration Page</span>
            <span className = "text-[16px] font-semibold">Welcome to Lush!</span>
        </div>
        <div className = "max-w-[600px] w-[90%] h-[500px] bg-[#FFF2E0] border-[1px] border-[white] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center">
            <form action="" className='w-[90%] h-[90%] flex flex-col items-center jutify-start gap-[20px]'>
                <div className = 'w-[90%] h-[50px] bg-[#FFF2E0] rounded-lg shadow-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer'>
                    <img src = {google} alt="/Image/" className='w-[20px]'/> Signup with Google
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