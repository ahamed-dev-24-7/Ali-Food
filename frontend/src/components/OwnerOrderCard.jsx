import axios from 'axios'
import React from 'react'
import { MdPhone } from "react-icons/md"
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { updateOrderStatus } from '../redux/userSlice'
import { useState } from 'react'
const OwnerOrderCard = ({ data }) => {

  const [availableBoys, setAvailableBoys] = useState([])
  const dispatch = useDispatch()
  

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, {status}, {withCredentials: true})
      dispatch(updateOrderStatus({orderId, shopId, status}))
      console.log(result.data)
      console.log("hi man")
      setAvailableBoys(result.data.availableBoys)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='bg-white rounded-lg shadow p-4 '>
      {/* for usr info */}
      <div className='flex flex-col gap-1'>
        <h2 className='text-lg font-semibold  '>{data.user.fullName}</h2>
        <p className='text-sm text-gray-500'>{data.user.email}</p>
        <p className='flex items-center justify-start gap-1' > <MdPhone /> <span>{data.user.mobile}</span></p>
      </div>


{/* for address and locataion */}
      <div className='flex flex-col items-start gap-2 text-gray-600 text-sm'>
        <p className=''>{data.deliveryAddress.text}</p>
        <p>Lat: {data?.deliveryAddress.latitude}, Lan:{data?.deliveryAddress.longitude}</p>

      </div>


      {/* for item */}
        <div className='flex space-x-4 overflow-x-auto pb-2'>
          {data.shopOrders.shopOrderItems.map((item, index) => (
            <div key={index} className='flex-shrink-0 w-40  '>
              <img className='w-full h-24 object-cover rounded' src={item.item.image} alt="" />
              <p className='text-sm font-semibold'>{item.name}</p>
              <p className='text-sm'>{item.price} x {item.quantity}</p>

            </div>
          ))}
        </div>

        {/* status */}
        <div className='flex justify-between items-center mt-auto pt-3 border-t border-gray-100'>
          <span className='text-sm'>Status: <span className='font-semibold capitalize text-blue-400'>{data.shopOrders.status}</span></span>
          <select onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value )} className='rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-blue-300' >
            <option value="">Change</option>
            <option value="pending">Pending</option>
            <option value="prepearing">Prepearing</option>
            <option value="out of delivery">Out Of Delivery</option>
            <option value="deliverd">Deliverd</option>

          </select>
        </div>

      {data.shopOrders.status== "out of delivery" &&  
       <div className='text-sm bg-orange-50 mt-2 p-2'>
        
      {/* if the any one acepted tahn you willl see this dlivery boys accepted or you will see available delivery boys are here  */}
        {data.shopOrders.assignedDeliveryBoys ? <p>This Delivery Boy Accepted</p> : <p>Available Delivery Boys are here:</p>     }

         {availableBoys?.length > 0 ? (
          availableBoys.map((b, i) => (
            <div className='text-gray-700'>{b.fullName}.{b.mobile}</div>
          ))
         ) : 
          data.shopOrders.assignedDeliveryBoys 
          ? <div className='font-semibold text-lg'>Name: {data.shopOrders.assignedDeliveryBoys.fullName } - Mobile: {data.shopOrders.assignedDeliveryBoys.mobile}</div> 
          : <div>waiting</div>}

       </div>
      }

       {/* total  */}
       <div className='font-bold  text-right mt-1 text-gray-700 text-sm '>
        Total: {data.shopOrders.subTotal} Tk
       </div>

    </div>
  )
}

export default OwnerOrderCard