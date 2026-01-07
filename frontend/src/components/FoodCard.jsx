import React, { useState } from 'react'
import { FaLeaf } from 'react-icons/fa'
import { FaDrumstickBite } from 'react-icons/fa'
import { FaStar } from "react-icons/fa"
import { FaRegStar } from "react-icons/fa6"
import { FaMinus } from "react-icons/fa6"
import { FaPlus } from "react-icons/fa6"
import { FaShoppingCart } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/userSlice'
const FoodCard = ({ data }) => {

  const [quantity, setQuantity] = useState(0)
  const disPatch = useDispatch()
  const {cartItems} = useSelector(state => state.user)
  const renderStarts = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        (i <= rating) ? (
          <FaStar className='text-[#5A7ACD]' />
        ) :
          <FaRegStar className='text-[#5A7ACD]' />
      )
    }
    return stars;
  }

  const handleIncress = () => {
    const newQt = quantity + 1
    setQuantity(newQt)
  }

  const handeDecress = () => {
    const newQt = quantity == 0 ? 0 : quantity - 1
    setQuantity(newQt)
  }


  return (
    <div className='w-[250px] rounded-2xl border-2 border-[#5A7ACD] bg-white overflow-hidden '>
      <div className='relative w-full h-[170px] flex justify-center items-center bg-white'>

        <div className='absolute top-3 right-3 bg-white rounded-full'>
          {data.foodtype === "Veg" ? <FaLeaf className='text-green-400' size={25} /> : <FaDrumstickBite className='text-[#5A7ACD]' size={25} />}

        </div>
        <img src={data.image} className='w-full h-full object-cover transition-transform' alt="" />
      </div>

      <div className='flex-1 flex flex-col p-4'>
        <h1 className='font-semibold text-gray-900 truncate'>{data.name}</h1>
        {/* rating */}
        <div className='flex items-center gap-1 mt-1'>
          {renderStarts(data.rating?.average) || 0}
          <span className='text-xs'>
            {data.rating?.count || 0}
          </span>



        </div>
      </div>

      {/* price */}
      <div className='flex items-center justify-between m-auto p-4'>
        <span className='font-bold'>
          {data.price} Tk

        </span>
        <div className='flex items-center border rounded-full overflow-hidden shadow-sm'>
          <button onClick={handeDecress} className='px-2 py-1 hover:bg-gray-100 transition'><FaMinus /></button>
          <span>{quantity}</span>
          <button onClick={handleIncress} className='px-2 py-1 hover:bg-gray-100 transition'><FaPlus /></button>
          <button onClick={() => {
            quantity > 0 &&
            disPatch(addToCart({
            id: data._id,
            name: data.name,
            price: data.price,
            image: data.image,
            shop: data.shop,
            quantity: quantity,
            foodtype: data.foodtype, 

          }))}} className={`${cartItems.some(i => i.id == data._id ) ? "bg-gray-800" : "bg-[#5A7ACD]"} text-white px-3 py-2 transition-colors`}><FaShoppingCart /></button>
        </div>

      </div>


    </div>
  )
}

export default FoodCard