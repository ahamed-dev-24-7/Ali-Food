import React, { useState } from 'react'
import { IoIosArrowBack } from "react-icons/io"
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';

const ForgetPass = () => {

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


  const handleSendOtp = async () => {
    setLoading(true)
    try {
      const result = axios.post(serverUrl + "/api/auth/sendotp", { email }, { withCredentials: true })
      console.log(result)
      // email === "" ? null : setStep(2) // i wrote this line becuse without it this change the step from 1 to 2 even if i didn't give any email so this is need to check the emial is that email has the value or empy
      setStep(2)
      setErr("")
      setLoading(false)
    } catch (error) {
      console.log(error)
      setErr(error?.response?.data?.message)
      setLoading(false)
    }
  }
  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const result = axios.post(serverUrl + "/api/auth/verifyotp", { email, otp }, { withCredentials: true })
      console.log(result)
      // otp === "" ? null : setStep(2)  //same ase prev
      setStep(3)
      setErr("")
      setLoading(false)
    } catch (error) {
      console.log(error)
      setErr(error?.response?.data?.message)
      setLoading(false)
    }
  }
  const handleResatPassowrd = async () => {
    setLoading(true)
    if (newPassword != confirmPassword) {
      return alert("password not match")
    }
    try {
      const result = axios.post(serverUrl + "/api/auth/reset-pssword", { email, newPassword }, { withCredentials: true })
      console.log(result)
      setStep(3)
      navigate("/signin")
      setErr("")
      setLoading(false)
    } catch (error) {
      console.log(error)
      setErr(error?.response?.data?.message)
      setLoading(false)
    }
  }


  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-orange-100'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
        <div className='flex items-center justify-center gap-4'>
          <IoIosArrowBack onClick={() => navigate("/signin")} className='text-orange-500 cursor-pointer' size={30} />
          <h1 className='font-semibold text-center text-orange-600'>Forgot Password</h1>
        </div>

        {step === 1
          &&
          <div>
            {/* email */}
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-1' htmlFor="email">Email</label>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='w-full px-2 border rounded-lg py-2 focus:outline-none focus:border-orange-500' placeholder='enter email' type="email" required />
            </div>

            <button onClick={handleSendOtp} disabled={loading} className='w-full flex items-center justify-center border rounded-lg px-4 py-2 cursor-pointer hover:bg-orange-300'>
              {loading ? <ClipLoader size={20}/> : "Send Otp"}
            </button>
            {/* show the error */}
            {err && <p className='text-red-500'>*{err}</p>}
          </div>

        }

        {
          step === 2
          &&
          <div>
            {/* otp */}
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-1' htmlFor="email">Enter Otp</label>
              <input onChange={(e) => setOtp(e.target.value)} value={otp} className='w-full px-2 border rounded-lg py-2 focus:outline-none focus:border-orange-500' placeholder='otp' type="text" />
            </div>

            <button onClick={handleVerifyOtp} disabled={loading} className='w-full flex items-center justify-center border rounded-lg px-4 py-2 cursor-pointer hover:bg-orange-300'>
              {loading ? <ClipLoader size={20}/> : "Verify Otp"}
            </button>
            {/* show the error */}
            {err && <p className='text-red-500'>*{err}</p>}
          </div>
        }

        {
          step === 3
          &&
          <div>
            {/* change password */}
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-1' htmlFor="email">New Password</label>
              <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} className='w-full px-2 border rounded-lg py-2 focus:outline-none focus:border-orange-500' placeholder='new password' type="text" />
            </div>
            {/* confirm password */}
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-1' htmlFor="email">Confirm Password</label>
              <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} className='w-full px-2 border rounded-lg py-2 focus:outline-none focus:border-orange-500' placeholder='confirm password' type="text" />
            </div>

            <button onClick={handleResatPassowrd} disabled={loading} className='w-full flex items-center justify-center border rounded-lg px-4 py-2 cursor-pointer hover:bg-orange-300'>
              {loading ? <ClipLoader size={20}/> : "Chnage Password"}
            </button>
            {/* show the error */}
            {err && <p className='text-red-500'>*{err}</p>}
          </div>
        }
      </div>
    </div>
  )
}

export default ForgetPass