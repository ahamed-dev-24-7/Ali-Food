import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { IoIosArrowRoundBack } from "react-icons/io"
import DeliverBoysTracking from '../components/DeliverBoysTracking'
import { useSelector } from 'react-redux'

const TrackOrderFUser = () => {

    const navigate = useNavigate()
    const { orderId } = useParams()
    const [currentOrder, setCUrrentOrder] = useState()
    const {socket} = useSelector(state => state.user)
    const [liveLocation, setLiveLocatio] = useState({}) 


    const handleGetOrder = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-orders-byid/${orderId}`, { withCredentials: true })
            setCUrrentOrder(result.data)
             console.log(result.data)

        } catch (error) {
            console.log(error)
        }
    }

    // this is for live taracking this updateDLocation listner comes from socket.js 

    useEffect(() => {
      socket.on('updateDLocation', ({longitude, latitude,deliveryBoyId}) =>{
        setLiveLocatio(prev => ({
            ...prev,
            [deliveryBoyId]: {lat: latitude, lng: longitude}
        }))
      })
    }, [socket])

    useEffect(() => {
        handleGetOrder()
    }, [orderId])

    return (
        <div className=' max-w-4xl p-4 flex flex-col gap-6'>
            <div className='relative flex items-center gap-4 top-[20px] left-[20px] z-[10] mb-[10px]'>
                <IoIosArrowRoundBack onClick={() => navigate("/")} className='text-orange-500' size={35} />
                <h1 className='text-2xl font-bold md:text-center'>Track Order</h1>
            </div>

{/* show releated aobut this order item */}
            {currentOrder?.shopOrders?.map((shopOrder, index) => (
                <div key={index} className='bg-white p-4 rounded-2xl shadow-md border-orange-100'>
                    <div>
                        <p className='text-lg font-blod mb-2 text-orange-400'>{shopOrder.shop.name}</p>
                        <p className='font-bold'><span>Items: </span>{shopOrder.shopOrderItems.map(i => i.name).join(" , ")}</p>
                        <p>SubTotal: {shopOrder.subTotal}Tk</p>
                        <p>Delivery Address: <span>{currentOrder?.deliveryAddress?.text}</span></p>

                    </div>
                
                {/* show releated about this order item delevery boy */}
                {shopOrder.status != "deliverd"  
                ? <>
               
                {shopOrder.assignedDeliveryBoys 
                ? <div className='text-sm'>
                    <p className=''><h1 className='font-semibold'>Delivery Boy Name</h1>{shopOrder.assignedDeliveryBoys.fullName}</p>
                    <p className=''><h1 className='font-semibold'>Delivery Boy Mobile </h1>{shopOrder.assignedDeliveryBoys.mobile}</p>

                </div>
                :<p>Delivery Boy is not assigned yet</p>
                }
                </>
                : <p className='text-green-400 font-semibold text-lg'> Deliverd</p>
                }

            {/* if anyone delivery boy accepted this order then there will be a map */}
            {(shopOrder.assignedDeliveryBoys &&  shopOrder.status !== "deliverd") &&
           <div>
             <DeliverBoysTracking data={{
                delivaryBoyLocation: liveLocation[shopOrder.assignedDeliveryBoys._id] || {
                    lat: shopOrder.assignedDeliveryBoys.location.coordinates[1],
                    lng: shopOrder.assignedDeliveryBoys.location.coordinates[0]
                },
                customerLocation: {
                    lat: currentOrder.deliveryAddress.latitude,
                    lng: currentOrder.deliveryAddress.longitude,
                }
            }} />
           </div>
            }


                </div>
            ))}


        </div>
    )
}

export default TrackOrderFUser