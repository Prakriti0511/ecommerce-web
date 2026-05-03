import React, { useState } from 'react'
import { signInWithPopup } from "firebase/auth"
import { useNavigate } from 'react-router-dom'
import { IoEyeOutline } from "react-icons/io5";
import { FiEyeOff } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";


function Login() {
      let [show,setShow] = useState(false)
      let navigate = useNavigate()
      return (
      <div className = 'w-[100%] h-[100vw] bg-[#f3f1ec] text-[#4b4b4b] flex flex-col gap-[10px]' style={{fontFamily: "'Playfair Display', 'Times New Roman', serif"}}>
          <div className = 'w-[100%] h-[40px] flex items-center px-[20px]'>
              <IoArrowBack className='pt-[6px] w-[24px] h-[24px] text-[#4b4b4b] cursor-pointer hover:text-[#706d68] transition' onClick={()=>navigate("/")}/>
          </div>
          <div className = 'w-[100%] h-[100px] flex flex-col items-center justify-center'>
              <span className='text-[25px] font-semibold pb-[10px]' style={{fontFamily: "'Playfair Display', 'Times New Roman', serif"}}>Login</span>
              <span className = 'text-[16px] font-semibold' style={{color: '#706d68'}}>Welcome back!</span>
          </div>
          <div className = 'max-w-[600px] w-[90%] h-[500px] bg-[#ece7e2] rounded-[10px] border border-[#ddd5cd] shadow-lg flex items-center justify-center mx-auto'>
              <form action="" className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
                  <div className = 'w-[90%] h-[50px] bg-[#f7e7c8] text-[#4b4b4b] border-2 border-[#ddd5cd] rounded-[10px] shadow-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer hover:bg-[#f0ddb8] transition'>
                      <img src = "google.png" alt="/Image/" className='w-[20px] rounded-[10px]'/> Sign in with Google
                  </div>
                  <div className='w-[100%] h-[20px] flex items-center justify-center gap-[10px]'>
                      <div className='w-[40%] h-[1px] bg-[#ddd5cd]'></div> OR <div className='w-[40%] h-[1px] bg-[#ddd5cd]'></div>
                  </div>
                  <div className = 'w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative'>
                      <input type = "text" className = 'w-[80%] h-[50px] border-[1px] border-[#ddd5cd] backdrop:blur-sm rounded-[10px] shadow-lg bg-[#faf8f3] placeholder-[#a89f99] px-[20px] font-semibold' placeholder = 'Username' required style={{color: '#4b4b4b'}}/>
                      <input type = "text" className = 'w-[80%] h-[50px] border-[1px] border-[#ddd5cd] backdrop:blur-sm rounded-[10px] shadow-lg bg-[#faf8f3] placeholder-[#a89f99] px-[20px] font-semibold' placeholder = 'Email' required style={{color: '#4b4b4b'}}/>
                      <input
                      type={show ? "text" : "password"}
                      className='w-[80%] h-[50px] border-[1px] border-[#ddd5cd] backdrop:blur-sm rounded-[10px] shadow-lg bg-[#faf8f3] placeholder-[#a89f99] px-[20px] font-semibold'
                      placeholder='Password'
                      required
                      style={{color: '#4b4b4b'}}
                      />
                      {!show && <IoEyeOutline className='w-[20px] h-[20px] pb-[6px] text-[#7e7972] cursor-pointer absolute right-[10%]' onClick={()=>setShow(prev => !prev)}/>}
                      {show && <FiEyeOff className='w-[20px] h-[20px] pb-[6px] text-[#7e7972] cursor-pointer absolute right-[10%]' onClick={()=>setShow(prev => !prev)}/>}
                      <button className='w-[80%] h-[45px] bg-[#f7e7c8] rounded-[8px] flex items-center justify-center mt-[15px] text-[15px] text-[#4b4b4b] font-semibold hover:bg-[#f0ddb8] transition border-[1px]'>Login </button>
                      <p className='flex gap-[10px]' style={{color: '#706d68'}}>Don't have an account? <span className='text-[#e891a8] text-[17px] font-semibold cursor-pointer' onClick={()=>navigate("/signup")}>Sign Up</span></p>
                  </div>
              </form>
          </div>
      </div>
    )
  }
  

export default Login
