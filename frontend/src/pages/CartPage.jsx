import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io"
import { useSelector } from 'react-redux'
import CartItemCart from '../components/CartItemCart'
import Footer from '../components/Footer'

const CartPage = () => {
    const navigate = useNavigate()
    const {cartItems, totalAmount} = useSelector(state => state.user)
    return (
      <>
        <div className='min-h-screen bg-white flex justify-center p-6'>
            <div className='w-full max-w-[800px]'>
                <div className='flex items-center gap-20 mb-6 '>
                    <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'>
                    <IoIosArrowRoundBack onClick={() => navigate("/")} className='text-orange-500' size={35} />
                </div>

                <h1 className='font-bold text-2xl'>Your Cart </h1>

                </div>

            {cartItems.length ===  0 ? (
                <p className='text-gray-700 text-center'>Cart Is Empty</p>
            ) : (
                <>
                <div>
                   {cartItems.map((item, index) => (
                    <CartItemCart data={item} key={index} />
                   ))}
                </div>
                <div className='mt-6 bg-white rounded-xl shadow flex justify-between items-center border p-5'>
                    <h1 className='font-bold text-2xl'>Total Amount</h1>
                    <p className='font-semibold text-green-800 text-lg'>{totalAmount} Bdt</p>
                </div>
                <div className='flex items-end justify-end mt-4'>
                    <button onClick={() => navigate("/checkout")} className='bg-[#5A7ACD] p-4 cursor-pointer shadow-2xl text-white font-medium rounded-xl'>Proced To CheckOut</button>
                </div>
                </>
            )
            }
              
 
            </div>
           
        </div>
         <Footer />
      </>
    )
}

export default CartPage