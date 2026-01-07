import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import Navbar from '../components/Navbar'
import ShopCard from '../components/ShopCard'
import { useDispatch, useSelector } from 'react-redux'
import Slidebar from '../components/Slidebar'
import { motion } from "framer-motion"
import Footer from '../components/Footer'
const ShopPage = () => {

  const { slider, userData , allShop} = useSelector(state => state.user)
  const navigate = useNavigate()
 
  return (
    <div>
      <Navbar />

      {/* slider */}
      {
        slider && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.2 }}
          >
            <div className='absolute text-white shadow-md shadow-white bg-[#F9F8F6] w-48 h-[90vh] z-10'>


              <Slidebar />


            </div>
          </motion.div>
        )
      }


      <div className='mt-18 w-[90%] m-auto mb-10 ' >
        <h1 className='text-gray-800 mb-5 font-semibold text-xl sm:text-3xl'>See World Most Famous Shop</h1>
        <div className='flex flex-col items-center justify-center'>
          <div className=' grid items-center justify-center grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
            {allShop.map((shop, index) => (
              <ShopCard onClick={() => navigate(`/shop/${shop._id}`)} name={shop.name} image={shop.image} key={index} />
            ))}

          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ShopPage