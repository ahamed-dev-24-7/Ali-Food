import React, { useState } from 'react'
import { asstes } from '../assets/assets'
import { items } from '../assets/assets'
import { motion } from "framer-motion"
import { useDispatch, useSelector } from 'react-redux'
import Slidebar from './Slidebar'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(asstes.items1)
  const dispatch = useDispatch()
  const { slider } = useSelector(state => state.user)

  return (
    // <div className='w-[100%] h-[100vh] '  style={{backgroundImage: `url(${asstes.items1} )`, backgroundRepeat: "no-repeat", backgroundPosition: "center"} }> bg-[#1C4D8D]

    // </div>
    <div style={{ backgroundImage: `url(${asstes.back} )`, backgroundRepeat: "no-repeat", backgroundPosition: "center" }} className='w-[100%] relative mt-14 text-white h-full sm:h-[90vh] '>

      {/* slider */}
      {
        slider && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.2 }}
            >
          <div className='fixed text-white shadow-md shadow-white bg-[#F9F8F6] w-48 h-[90vh] z-10'>
              <Slidebar />         
          </div>
          </motion.div>
        )
      }

      <div className='absolute w-50 h-50 sm:w-96 sm:h-96 rounded-full top-40 right-12 sm:top-10 sm:right-30 shadow  bg-white/75 opacity-15 '></div>

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className=' flex flex-col sm:flex-row w-[80%] m-auto items-center justify-between'>
          <div>
            <div className='hidden sm:flex items-start flex-col text-6xl font-bold'>
              <span>Fresh Food,</span>
              <span>Faster Then Ever</span>
            </div>
            {/* for small diveie */}
            <div className='mt-10 sm:hidden'>
              <span>Fresh Food,</span>
              <span>Faster Then Ever</span>
            </div>

            <h1 className='font-bold text-xl flex flex-col items-start'>Welcome to <span className='font-bold text-3xl sm:text-6xl'>Ali-Food</span></h1>
            <div className=' hidden sm:flex items-center gap-3 mt-10'>
              <button className='bg-blue-500 px-3 shadow  py-1 rounded-lg font-medium'>Order Now</button>
              <button className='border border-blue-200  px-3 shadow  py-1 rounded-lg font-medium'>View Menu</button>
            </div>
          </div>
          <div>
            <img className='w-96' src={selectedImage} alt="" />
          </div>
        </div>
      </motion.div>



      <div className='flex items-center translate-x-10 sm:translate-x-30'>
        {items.map((item, index) => (
          <div className=''>
            <img onClick={() => setSelectedImage(item.image)} className={`w-10 sm:w-24 ${item.image == selectedImage ? "border-2 border-blue-300" : ""}`} src={item.image} alt="" />

          </div>
        ))}
      </div>



      {/* this is for small device */}
      <div className='flex items-center justify-center gap-3 mt-2 sm:hidden '>
        <button onClick={() => navigate("/all-food")} className='bg-blue-500 px-3 shadow  py-1 rounded-lg font-medium'>Order Now</button>
        <button  onClick={() => navigate("/all-food")}  className='border border-blue-200  px-3 shadow  py-1 rounded-lg font-medium'>View Menu</button>
        <div className='mt-20'></div>
      </div>

    </div>
  )
}

export default Banner