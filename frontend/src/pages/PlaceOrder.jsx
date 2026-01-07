import React from 'react'
import {FaCircleCheck} from "react-icons/fa6"
import { useNavigate } from 'react-router-dom'
const PlaceOrder = () => {
    const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-white flex flex-col justify-center items-center px-4 text-center relative overflow-hidden'>
     <FaCircleCheck className='text-green-400 text-6xl mb-4' />
     <h1 className='text-3xl font-bold text-gray-800'>Order Placed</h1> 
     <p>Thank you for your purches, your order is being prepared you can track your order in my orders secriont</p>
     <button onClick={() => navigate("/my-orders")} className='bg-[#5a7acd] py-2 text-white px-6 rounded-lg text-lg font-medium transition'> Back to My Orders</button>
    </div>
  )
}

export default PlaceOrder