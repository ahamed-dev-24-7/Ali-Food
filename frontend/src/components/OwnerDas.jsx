import React from 'react'
import Navbar from './Navbar'
import { useSelector } from 'react-redux'
import { FaUtensils } from "react-icons/fa"
import { FaPen } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import OwnerItemCar from './OwnerItemCar'

const OwnerDas = () => {

  const { shopData } = useSelector(state => state.owner)
  const navigate = useNavigate()


  return (
    <div className='w-full min-h-screen bg-white flex flex-col items-center mt-16'>
      <Navbar />

      {!shopData &&
        <div className='flex justify-center items-center p-6 sm:p-6'>
          <div className='w-full max-w-md bg-white transition-shadow shadow-lg p-6 border border-gray-100 hover:shadow-xl duration-300'>
            <div className='flex flex-col items-center text-center'>
              <FaUtensils className='text-blue-500 w-16 sm:w-20 sm:h-20 mb-4' />
              <h1 className='text-xl font-bold m-2'>Add Your Resturent</h1>
              <p className='text-gray-600 text-sm '>Join our food deleivary platform</p>
              <button onClick={() => navigate("/create-edit-shop")} className='bg-[#5A7ACD] text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-amber-600 transition-colors duration-200 mt-4'>Get Sarted</button>
            </div>
          </div>

        </div>
      }

      {/* now create the shop */}
      {shopData &&
        <div className=' flex-col items-center justify-center gap-6 px-4 sm:px-6'>
          <h1 className='text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center'> <FaUtensils className='text-blue-500 w-14 sm:w-20 sm:h-20 mb-4' />Welcome to {shopData.name}</h1>

          <div className='bg-white w-full shadow-lg overflow-hidden border border-blue-100 hover:shadow-2xl transition-all duration-300 max-w-3xl relative'>
            <div className='absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-400 transition-colors cursor-pointer'>
              <FaPen onClick={() => navigate("create-edit-shop")} />
            </div>
            <img className='w-full h-48 sm:h-64 object-cover' src={shopData.image} alt={shopData.name} />

            <div className='p-4 sm:p-6'>
              <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2 '>{shopData.name}</h1>
              <p className='text-gray-500'>{shopData.city}, {shopData.state}</p>
              <p className='text-gray-500'>{shopData.address}</p>

            </div>


          </div>


          {/* now create the food item */}
               {shopData.items.length == 0 && 
            <div className='flex justify-center items-center p-6 sm:p-6'>
          <div className='w-full max-w-md bg-white transition-shadow shadow-lg p-6 border border-gray-100 hover:shadow-xl duration-300'>
            <div className='flex flex-col items-center text-center'>
              <FaUtensils className='text-blue-500 w-16 sm:w-20 sm:h-20 mb-4' />
              <h1 className='text-xl font-bold m-2'>Add Your Food Item</h1>
              <p className='text-gray-600 text-sm '>Share your delicous food so that other can buy</p>
              <button onClick={() => navigate("/add-food")} className='bg-[blue] text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-amber-600 transition-colors duration-200 mt-4'>Add Food</button>
            </div>
          </div>

        </div>
          }


          {/* if has any itmes */}
          {shopData.items.length > 0 && 
          <div className='flex flex-col items-center gap-4 w-full max-w-3xl'>
            {[...shopData.items].reverse().map((item, index)=> (
              <OwnerItemCar data={item} key={index} />
            ))}
          </div>
          }

        </div>
       
       

      }


    </div>
  )
}

export default OwnerDas