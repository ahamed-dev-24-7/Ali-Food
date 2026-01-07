import axios from 'axios'
import React from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import {FaStore} from "react-icons/fa6"
import {FaLocationDot} from "react-icons/fa6"
import {FaUtensils} from "react-icons/fa"
import FoodCard from '../components/FoodCard'
import { IoIosArrowRoundBack } from "react-icons/io"
import Footer from '../components/Footer'

const Shop = () => {
    const {shopId} = useParams()
    const [items, setItems] = useState([])
    const [shop, setShop] = useState([])
    const navigate = useNavigate()
    const handleShop = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/get-item-byshop/${shopId}`, {withCredentials: true})
            setShop(result.data.shop)
            setItems(result.data.items)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
      handleShop()
    }, [shopId])
  return (
    <div className='min-h-screen bg-gray-50'>
        {shop && 
         <div className='relative w-full h-64 md:h-80 lg:h-96'>
            {/* back icon */}
          <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'>
                    <IoIosArrowRoundBack onClick={() => navigate("/")} className='text-[#5A7ACD]' size={80} />
            </div>

            <div className=' absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4'>
              <FaStore className='text-white text-4xl mb-3 drop-shadow-2xl' />
              <h1 className='text-3xl md:text-5xl font-extrabold text-white'>{shop.name}</h1>
              <p className='text-lg text-white mt-4 flex items-center gap-2'><FaLocationDot /> {shop.address}</p>

            </div>
            <img className='w-full h-full object-cover' src={shop.image} alt="" />

         </div>
        }

        <div className='max-w-7xl mx-auto px-6 py-10'>
            <h2 className='flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-gray-800 '><FaUtensils /> Our Menu</h2>
            {items.length > 0 ? 
             <div className='flex flex-wrap justify-center gap-8'>  
                {items.map((item, index) => (
                    <FoodCard data={item}  />
                ))}
             </div>
             : <p>No item available</p>
            }

        </div>

        <Footer />

    </div>
  )
}

export default Shop