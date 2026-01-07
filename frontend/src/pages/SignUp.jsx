import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa"
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { CircleLoader, ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { asstes } from '../assets/assets';

const SignUp = () => {

  const primaryColour = "#5A7ACD";
  const hoverColor = "#e64323";
  const bgColor = "#fff9fc";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState("user")


  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const navigate = useNavigate();


  const hangleSignUp = async () => {
    setLoading()
    try {
      const result = await axios.post(serverUrl + "/api/auth/signup", { fullName, email, password, mobile, role }, { withCredentials: true })
      dispatch(setUserData(result.data))
      console.log(result)
      setErr("")
      setLoading(false)
    } catch (error) {
      setErr(error?.response?.data?.message)
      setLoading(false)
    }
  }


  //  akkhon sign up using goolge
  const handleGoolgeSignUp = async () => {

    if (!mobile) {
      return setErr("mobile number is requried")
    }
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)

    try {
      const { data } = await axios.post(serverUrl + "/api/auth/google-auth", {
        fullName: result.user.displayName,
        email: result.user.email,
        role,
        mobile
      }, { withCredentials: true })
      dispatch(setUserData(data))
      console.log(data)
    } catch (error) {
      console.log(error)
    }

  }
// style={{ backgroundColor: bgColor }}


  return (
    <div className='relative bg-img min-h-screen  flex items-center justify-center p-4' >
       <img 
    src={asstes.logo2}
    alt="Logo" 
        className="hidden sm:flex absolute top-4 left-12 w-40 h-auto z-10"
  />
     
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]  `} style={{ border: `1px solid ${borderColor} ` }} >
        <h1 className={`text-3xl font-bold mb-2`} style={{ color: primaryColour }}>Ali-Food</h1>
        <p className='text-gray-600 mb-8'>Create your account to get started with foord</p>

        {/* fullname */}
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-1' htmlFor="fullname">Full Name</label>
          <input onChange={(e) => setFullName(e.target.value)} value={fullName} className='w-full px-2 border rounded-lg py-2 focus:outline-none focus:border-orange-500' placeholder='enter your full name' type="text" style={{ border: `1px solid ${borderColor} ` }} required />
        </div>
        {/* email */}
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-1' htmlFor="email">Email</label>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='w-full px-2 border rounded-lg py-2 focus:outline-none focus:border-orange-500' placeholder='enter email' type="email" style={{ border: `1px solid ${borderColor} ` }} required />
        </div>
        {/* mobile */}
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-1' htmlFor="mobile">Mobile</label>
          <input onChange={(e) => setMobile(e.target.value)} value={mobile} className='w-full px-2 border rounded-lg py-2 focus:outline-none focus:border-orange-500' placeholder='enter mobile number' type="text" style={{ border: `1px solid ${borderColor} ` }} required />
        </div>
        {/* password */}
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-1' htmlFor="password">Password</label>
          <div className='relative'>
            <input onChange={(e) => setPassword(e.target.value)} value={password} type={`${showPassword ? "text" : "password"}`} className='w-full px-2 border rounded-lg py-2 focus:outline-none focus:border-orange-500' placeholder='password' style={{ border: `1px solid ${borderColor} ` }} required />
            <button onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-2.5 text-gray-500'>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
          </div>
        </div>
        {/* role */}
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-1' htmlFor="role">Role</label>
          <div className='flex gap-2'>
            {
              ["user", "owner", "delivaryBoy"].map((r) => (
                <button onClick={() => setRole(r)} style={role == r ? { backgroundColor: primaryColour, color: "white" } : { border: `1px solid ${primaryColour}`, color: "#333" }} className='flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer'>{r}</button>
              ))

            }

          </div>
        </div>

        {/* sign up button */}
        <button onClick={hangleSignUp} disabled={loading} className='w-full flex items-center justify-center border rounded-lg px-4 py-2 cursor-pointer hover:bg-slate-300'>
          {loading ? <ClipLoader size={20} /> : "Sign UP"}
        </button>
        {/* showing the error */}
        <p className='text-red-500 text-center'>{err ? `${err} *` : ""}</p>

        {/* button for google */}
        <button onClick={handleGoolgeSignUp} className='flex w-full items-center justify-center gap-2 rounded-lg py-2 px-4 border border-gray-200 cursor-pointer hover:bg-slate-100 mt-2'>
          <FaGoogle size={20} />
          <span>Sign up with google</span>

        </button>

        <p className='text-center'>Already have an account ? <span onClick={() => navigate("/signin")} className='text-slate-800 cursor-pointer'> Sign In</span></p>

      </div>

    </div>
  )
}

export default SignUp