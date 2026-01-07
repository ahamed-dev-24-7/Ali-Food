import React from 'react'
import { FaMinus } from "react-icons/fa6"
import { FaPlus } from "react-icons/fa6"
import { MdDeleteSweep } from "react-icons/md";
import {useDispatch} from "react-redux"
import { updateQuantity, removeItem } from '../redux/userSlice';
const CartItemCart = ({ data }) => {

   const dispatch = useDispatch()

    const handleIncress = (id, currentQuantity) => {
     dispatch(updateQuantity({id: id, quantity: currentQuantity + 1}))
   
  }

  const handeDecress = (id, currentQuantity) => {
   if(currentQuantity > 1){
     dispatch(updateQuantity({id: id, quantity: currentQuantity - 1}))
   }
  }
    return (
        <div className='flex items-center justify-between bg-[#BDE8F5] rounded-2xl shadow p-4 mt-5'>
            <div className='flex items-center gap-6'>
                <img className='w-20 h-20' src={data.image} alt="" />
                <div className='flex flex-col'>
                  <h1>{data.name}</h1>
                  <p>৳{data.price} x <span>{data.quantity}</span></p>
                  <p className='font-semibold'>৳{data.price * data.quantity}</p>
                </div>
            </div>
            <div className='flex items-center'>
                <button onClick={() => handeDecress(data.id, data.quantity)} className='px-2 py-1 hover:bg-gray-100 transition cursor-pointer'><FaMinus /></button>
                <span className='text-red-400'>{data.quantity}</span>
                <button  onClick={() => handleIncress(data.id, data.quantity)}  className='px-2 py-1 hover:bg-gray-100 transition cursor-pointer'><FaPlus /></button>
                <button><MdDeleteSweep onClick={() => dispatch(removeItem(data.id))} size={25} /></button>
            </div>
        </div>
    )
}

export default CartItemCart