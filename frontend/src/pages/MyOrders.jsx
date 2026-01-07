import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io"
import { useNavigate } from 'react-router-dom'
import UserOrderCard from '../components/UserOrderCard'
import OwnerOrderCard from '../components/OwnerOrderCard'
import { setMyOrders, updateRealTimeOrderStatus } from '../redux/userSlice'
import Footer from '../components/Footer'


const MyOrders = () => {

    const { userData, myOrders , socket} = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
    // this is for instade update when someone order any item
    socket?.on('newOrder', (data) => {
     if(data.shopOrders.owner._id = userData._id){
        dispatch(setMyOrders([data, ...myOrders]))
     }
    })

    // this is for update status
    socket?.on('update-status', ({orderId,shopId, status, userId}) => {
        if(userId === userData._id){
            dispatch(updateRealTimeOrderStatus({orderId, shopId, status}))
        }
    })
    return () => {
        socket?.off('newOrder')
        socket?.off('update-status')
    }
    }, [socket])


    return (
      <>
            <div className='w-full min-h-screen bg-white flex justify-center px-4'>
            <div className='w-full max-w-[800px] p-4'>
                <div className='flex items-center gap-20 mb-6 '>
                    <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'>
                        <IoIosArrowRoundBack onClick={() => navigate("/")} className='text-[#5a7acd]' size={35} />
                    </div>

                    <h1 className='font-bold text-2xl'>My Orders </h1>

                </div>

            <div className='space-y-6'>
               {myOrders.map((order, index) => (
                userData.role == "user" ? (
                    <UserOrderCard data={order} key={index} />
                ) :
                 userData.role == "owner" ? (
                    <OwnerOrderCard data={order} key={index} />
                 ) : null 
                
               ))}

            </div>


            </div>

        </div>
        <Footer />
      </>
    )
}

export default MyOrders