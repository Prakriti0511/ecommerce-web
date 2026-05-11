import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FiEyeOff } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { auth, provider } from "../../../utils/Firebase";
import "./AuthCommon.css";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

function Login() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const firebaseResult = await signInWithPopup(auth, provider);
      const googleUser = firebaseResult.user;

      const response = await fetch(`${API_BASE}/api/auth/googlelogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: googleUser.displayName || googleUser.email?.split("@")[0] || "Google User",
          email: googleUser.email,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Google sign in failed");
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to login with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className='auth-page w-[100%] h-[100vw] bg-[#f3f1ec] text-[#4b4b4b] flex flex-col gap-[10px]'>
          <div className='w-[100%] h-[40px] flex items-center px-[20px]'>
              <IoArrowBack className='pt-[6px] w-[24px] h-[24px] text-[#4b4b4b] cursor-pointer hover:text-[#706d68] transition' onClick={() => navigate("/")}/>
          </div>
          <div className='w-[100%] h-[100px] flex flex-col items-center justify-center'>
              <span className='text-[25px] font-semibold pb-[10px]'>Login</span>
              <span className='auth-subtitle text-[16px] font-semibold'>Welcome back!</span>
          </div>
          <div className='auth-card max-w-[600px] w-[90%] h-[500px] rounded-[10px] shadow-lg flex items-center justify-center mx-auto'>
              <form onSubmit={handleLogin} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
                  <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className='auth-google-btn w-[90%] h-[50px] rounded-[10px] shadow-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer transition disabled:opacity-70'>
                      <img src = "google.png" alt="/Image/" className='w-[20px] rounded-[10px]'/> Sign in with Google
                  </button>
                  <div className='w-[100%] h-[20px] flex items-center justify-center gap-[10px]'>
                      <div className='auth-divider w-[40%] h-[1px]'></div> OR <div className='auth-divider w-[40%] h-[1px]'></div>
                  </div>
                  <div className='w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative'>
                      <input type="text" name="username" value={formData.username} onChange={onChange} className='auth-input w-[80%] h-[50px] backdrop:blur-sm rounded-[10px] shadow-lg px-[20px] font-semibold' placeholder='Username' required />
                      <input type="email" name="email" value={formData.email} onChange={onChange} className='auth-input w-[80%] h-[50px] backdrop:blur-sm rounded-[10px] shadow-lg px-[20px] font-semibold' placeholder='Email' required />
                      <input
                      type={show ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={onChange}
                      className='auth-input w-[80%] h-[50px] backdrop:blur-sm rounded-[10px] shadow-lg px-[20px] font-semibold'
                      placeholder='Password'
                      required
                      />
                      {!show && <IoEyeOutline className='auth-eye-icon w-[20px] h-[20px] pb-[6px] cursor-pointer absolute right-[10%]' onClick={() => setShow((prev) => !prev)}/>}
                      {show && <FiEyeOff className='auth-eye-icon w-[20px] h-[20px] pb-[6px] cursor-pointer absolute right-[10%]' onClick={() => setShow((prev) => !prev)}/>}
                      {error ? <p className='auth-error text-[14px] font-semibold'>{error}</p> : null}
                      <button disabled={isLoading} className='auth-submit-btn w-[80%] h-[45px] rounded-[8px] flex items-center justify-center mt-[15px] text-[15px] font-semibold transition disabled:opacity-70'>{isLoading ? "Please wait..." : "Login"}</button>
                      <p className='auth-subtitle flex gap-[10px]'>Don't have an account? <span className='auth-link text-[17px] font-semibold cursor-pointer' onClick={() => navigate("/signup")}>Sign Up</span></p>
                  </div>
              </form>
          </div>
      </div>
    );
}

export default Login;
