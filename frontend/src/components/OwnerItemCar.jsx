import axios from 'axios'
import React from 'react'
import {FaPen, FaTrash} from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setShopData } from '../redux/ownerSlice'
const OwnerItemCar = ({data}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {shopData} = useSelector(state => state.owner)

  const deleteItem = async() =>{
    try {
      const result =  await axios.get(serverUrl + `/api/item/delete-item/${data._id}`, {withCredentials: true})
      dispatch(setShopData(result.data))
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex bg-white rounded-lg shadow-md overflow-hidden border border-r-blue-400 w-full max-w-2xl mt-8'>
        <div className='w-36 h-full flex-shrink-0 bg-gray-50'>
   
          <img src={data.image} className='w-full object-cover' alt="" />
        </div>
        <div className='flex flex-col justify-between p-3 flex-1'>
          <div className=''>
            <h1 className='text-base font-semibold'>{data.name}</h1>
            <p ><span className='font-medium text-gray-700'>Category:</span> {data.category}</p>
            <p ><span className='font-medium text-gray-700'>Food Type:</span> {data.foodtype}</p>
          </div>
          {/* for edit and price */}
          <div className='flex items-center justify-between'>
            <div className='text-blue-400 font-bold'>{data.price}</div>
            <div className='flex items-center gap-3 '>
              <FaPen onClick={() => navigate(`/edit-item/${data._id}`)} size={25} className='text-blue-400 hover:text-blue-300 cursor-pointer' />
              <FaTrash onClick={deleteItem} size={25} className='text-blue-500 hover:text-blue-300 cursor-pointer' />
            </div>

          </div>
          
        </div>
      

    </div>
  )
}

export default OwnerItemCar