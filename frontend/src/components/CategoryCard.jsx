import React from 'react'

const CategoryCard = ({name, image, onClick}) => {
  return (
    <div onClick={onClick} className='relative w-[220px] h-[140px] rounded-2xl border-2 border-[#5A7ACD] shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow'>
      <img src={image} className='w-full h-full object-cover transform hover:scale-110 transition-transform duration-300' alt="" />
      <div className='absolute bottom-0 w-full left-0 bg-white px-3 py-1 rounded-t-xl text-center shadow text-sm font-medium text-gray-800 backdrop-blur'>
        {name}

      </div>
    </div>
 
  )
}

export default CategoryCard