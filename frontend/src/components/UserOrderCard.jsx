import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { IoMdStarOutline } from "react-icons/io";

const UserOrderCard = ({data}) => {

  const [selectedRating, setSelecetedRating]=useState({})  //itemId: rating store liked that

  const navigate = useNavigate()

    const formateDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const handleRaitng = async(itemId, rating) => {
      try {
        const result = await axios.post(`${serverUrl}/api/item/rating`, {itemId, rating}, {withCredentials: true})
        setSelecetedRating(prev => ({
          ...prev, [itemId]: rating
        }))
        console.log(result.data)

        
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className='bg-[#5a7acd] rounded-lg shadow p-4'>
      <div className='flex justify-between border-b pb-2'>
        <div className=''>
            <p className='font-semibold'>order # {data._id.slice(-6)}</p>
            <p className='text-sm text-gray-800'>Date: {formateDate(data.createdAt)}</p>

        </div>
        <div className='text-right'>
            <p className='font-semibold'>{data.paymentMethod?.toUpperCase()}</p>
            <p className='text-gray-800 '>{data.shopOrders[0].status}</p>


        </div>

      </div>

      {data.shopOrders.map((shopOrder, index) => (
        <div className='border mt-5 p-2 rounded-lg bg-[#BDE8F5] space-y-4' key={index}>
            <p className='font-bold p-2 text-blue-900 text-xl'>{shopOrder.shop.name}</p>
            <div className='flex space-x-4 overflow-x-auto pb-2'>
                {shopOrder.shopOrderItems.map((item, index) => (
                    <div key={index} className='flex-shrink-0 w-40  '>
                        <img className='w-full h-24 object-cover rounded' src={item.item.image} alt="" />
                        <p className='text-sm font-semibold'>{item.name}</p>
                        <p className='text-sm'>{item.price} x {item.quantity}</p>

                        {/* rarings */}
                        {shopOrder.status == 'deliverd' &&  (
                           <div className='flex space-x-1 mt-2'>
                         { [1, 2, 3, 4, 5].map((star) => (
                        <>
                           <button  onClick={() => handleRaitng(item.item._id, star)} className={`text-lg ${selectedRating[item.item._id] >= star ? 'text-yellow-400' : 'text-gray-400 border'}`}><IoMdStarOutline  /></button>
                        </>
                         ))}

                        </div>
                        )
                       
                        }

                       
                    </div>
                ))}


            </div>
            <div className='flex justify-between items-center border-t pt-2'>
              <p className='font-semibold'>Subtotal : {shopOrder.subTotal}</p>
              <span className='text-blue-500 text-sm'>Status: {shopOrder.status}</span>

            </div>
        </div>
      ))}

      <div className='flex p-2 justify-between items-center  pt-2'>
        <p className='font-semibold'>Total : {data.totalAmount}</p>
        <button onClick={() => navigate(`/track-order/${data._id}`)} className='bg-[#5A7ACD] text-white px-4 py-2 rounded'>Track Order</button>
      </div>
    </div>
  )
}

export default UserOrderCard