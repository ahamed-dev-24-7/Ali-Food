import React, {useRef} from 'react'
import { motion } from 'framer-motion'

const ShopCard = ({name, image, onClick}) => {


  return (
<>
    <motion.div
     initial={{x: -100, opacity: 0}}
     whileInView={{x: 0, opacity: 1}}
     viewport={{once: true, amount: 0.2}}
     transition={{duration:0.8}}
    >
  
        <div onClick={onClick} className='relative w-52 sm:min-w-96 rounded-2xl border-2 border-[#5A7ACD] shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow'>
        <img className='w-full h-48 sm:h-56 object-cover transform hover:scale-110 transition-transform duration-300' src={image} alt="" />
        <div className='absolute bottom-0 w-full left-0 bg-white py-1 sm:py-3 sm:px-3 rounded-t-xl text-center shadow text-sm font-medium text-gray-800 backdrop-blur'>
        <h1 className='text-xl font-semibold'>{name}</h1>

      </div>
    </div>

    </motion.div>
</>
  )
}

export default ShopCard



    
