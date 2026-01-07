import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import Slidebar from '../components/Slidebar'
import { motion } from "framer-motion"
import FoodCard from '../components/FoodCard'
import Footer from '../components/Footer'
const AllFoodPage = () => {
 
       const {slider, userData , allItem} = useSelector(state => state.user)
      const navigate = useNavigate()
      const dispatch = useDispatch()

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


      <div className='w-[80%] m-auto'>
        <h1  className='text-gray-800 mt-20 mb-5 font-semibold text-3xl'>Best Food In The World </h1>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
             {
        allItem.map((food, key) => (
            <div key={key}>
                <FoodCard data={food} />

            </div>
        ) )
      }

        </div>
      </div>
        <Footer />
    </div>
  )
}

export default AllFoodPage