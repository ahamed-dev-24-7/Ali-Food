import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { useState } from 'react'
import DeliverBoysTracking from './DeliverBoysTracking'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ClipLoader } from 'react-spinners'


const DelivaryDash = () => {

  const {userData, socket } = useSelector(state => state.user)
  const [availAbleAssignment, setAvailbleAssignment] = useState([])
  const [currentOrder, setCurrentOrder] = useState()
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otp, setOtp] = useState("")
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [todayDeliveries, setTodayDelivireys] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

    // this is for live tracking
    // basically socket io wokrs by emit and listen, emit like backend and listen like frontend, form here we emit beacuse we want send the location of delivery boys to the backend in backend sokcet.js a listner will be call like sokcet.io, and then another emit wil be call for user , and then another listner will be call in the frontend so that user can call the emit
  useEffect(() => {
    if(!socket || userData.role !== "delivaryBoy") return
    let watched
    if(navigator.geolocation){
      navigator.geolocation.watchPosition((positoin) => {
        const latitude = positoin.coords.latitude
        const longitude = positoin.coords.longitude
        setDeliveryBoyLocation({lat: latitude, lng: longitude})
        socket.emit('updateLocation' , {
          latitude,
          longitude,
          deliveryBoyId: userData._id,
        })
      }),

      (error) => {
        console.log(error)
      },
      {
      enableHighAccuracy: true
      }

      return () => {
        if(watched)navigator.geolocation.clearWatch(watched)
      }
    
    }
  }, [socket, userData])

  // to see all the order newby 5k 
  const getDeliveryBoyAssignment = async() => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/getDeliveryBoyAssignment`, {withCredentials: true})
      setAvailbleAssignment(result.data)
      console.log(result.data)
      
    } catch (error) {
      console.log(error)
    }
  }

    // after accetpt to get the current acceptted order
  const getCurrentOrder = async() => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-orders`, {withCredentials: true})
      console.log(result.data)
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  // this is the accept button
  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, {withCredentials: true})
      console.log(result.data)
      getCurrentOrder()
    } catch (error) {
      console.log(error)
    }
  }


  // this is for get otp 
  const sendOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/order/send-dliveryotp`, {
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id
      },{withCredentials: true})
      setLoading(false)
      console.log(result.data)
      setShowOtpBox(true)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  // this is for get otp 
  const verifyOtp = async () => {

    try {
       const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id,
        otp: otp
      },{withCredentials: true})
      console.log(result.data)
      alert("sucesuflly")
      location.reload()
 
    } catch (error) {
      console.log(error)
    }
  }



  // this is for instade update the delivery dash
  // this is not working 
  // useEffect(() => {
  //   socket?.on('newAssignment', (data) => {
  //     if(data.sentTo == userData._id){
  //       setAvailbleAssignment(prev =>[...prev, data])
  //     }
  //   })
  //   return () => {
  //     socket?.off('newAssignment')
  //   }
  // }, [socket])


  const handleTodayDelivery = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, {withCredentials: true})
      console.log(result.data)
      setTodayDelivireys(result.data)
    } catch (error) {
      console.log(error)

    }
  }

  // get all delivery boys earning
 
    const ratePerDelivery = 50
    const totalEarning = todayDeliveries.reduce((sum,d) => sum + d.count * ratePerDelivery,0)



  useEffect(() => {
   getDeliveryBoyAssignment()
   getCurrentOrder()
   handleTodayDelivery()
   console.log(todayDeliveries)
  }, [userData])

  return (

    <div className='w-screen min-h-screen flex flex-col items-center gap-5 overflow-auto'>
      <Navbar />

       <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>
        <div className='mt-20 bg-white rounded-2xl shadow-md p-5 flex justify-between items-center w-[90%] border border-orange-100'>
          <h1 className='font-bold text-red-500'>Wlcome, {userData.fullName}</h1>
           <div className='flex items-start text-orange-600 justify-center flex-col'>
            {/* this two aer use before apply live tracking */}
              {/* <p >Latitude:{userData.location.coordinates[0]}</p>
              <p>Longitude:{userData.location.coordinates[1]}</p> */}
              {/* after useing live traciking */}
              {/* <p> Latitude:{deliveryBoyLocation?.lat}</p> */}
              {/* <p> Longitude:{deliveryBoyLocation?.lng}</p> */}    
           </div>
        </div>

      {/* the bar chaet */}
       <div className=' bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100'>
        <h1 className='text-orange-400'>Today Delivery</h1>
        <ResponsiveContainer width=" 100%" height={200} >
          <BarChart data={todayDeliveries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tickFormatter={(h) => `${h}: 00`} />
            <YAxis dataKey="count" allowDecimals={false} />
            <Tooltip formatter={(value) => [value, "orders"]} labelFormatter={(label) => `${label}:00`} />
              <Bar dataKey="count" fill='#ff4d2d' />
              
              <div>
                 
              </div>

          </BarChart>
        </ResponsiveContainer>



       </div>
       <div>
        <h1 className='text-3xl font-bold'>Today Earnings: <span className='text-green-400'>{totalEarning}Tk</span></h1>
       </div>



       {/* if this delivery boy now dont't accept any order thaen he will se this div here or not mean current order na thakle eta hidden hoye jave  */}
       {!currentOrder && 
          <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-200'>
          <h1 className='font-semibold text-lg'>Available Order</h1>
          
          <div className='space-y-4 '>
            {availAbleAssignment.length > 0 ? (
              availAbleAssignment.map((a, index) => (
                <div className='border p-2 rounded-lg flex justify-between items-center'>
                  <div className=' ' key={index}>
                  <p className='text-sm font-semibold'>{a.shopName}</p>
                  <p className='text-sm text-gray-500'><span className='font-semibold'>Delivery Address:</span> {a.deliveryAddress.text}</p>
                  <p>{a.items.length} items | {a.subTotal}</p>

                </div>
                <button onClick={() => acceptOrder(a.assignmentId)} className='bg-orange-500 text-white px-4 py-1  rounded'>Accept</button>
                </div>
              ))
            ) : <p className='text-gray-400 text-sm'>No Available Orders</p>}

          </div>

        </div>
       }

       {/* if this delivery boy accept any order then here he will see all the infromation about current accepted ordere */}
       {currentOrder && 
        <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-blue-500'>
          <h1>Current Order</h1>

          <div>
            <p>{currentOrder?.shopOrder.shop.name}</p>
            <p>{currentOrder?.deliveryAddress.text}</p>
             <p>{currentOrder.shopOrder.shopOrderItems.length} items | {currentOrder.shopOrder.subTotal}Tk</p>
          </div>



       {/* here is this apply after apply live trakcing mehtode */}
       <DeliverBoysTracking data={{ 
                delivaryBoyLocation: deliveryBoyLocation || {  
                    lat: userData.location.coordinates[1],
                    lng: userData.location.coordinates[0]
                },
                customerLocation: {
                    lat: currentOrder.deliveryAddress.latitude,
                    lng: currentOrder.deliveryAddress.longitude,
                }
       }} />
        </div>
       }

       {!showOtpBox
        ? <button  onClick={sendOtp} className='mt-4 mb-20 rounded-2xl py-2 w-[90%]  bg-green-400 text-white font-semibold shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200' disabled={loading}> {loading? <ClipLoader /> : "Mark As Deliverd"}  </button>
      
     
        : <div className='mt-4 w-[90%] px-4 flex flex-col gap-4  border rounded-xl bg-gray-50 mb-20'>
         <p className='mt-4 py-1 text-center bg-orange-400 text-white font-semibold  border rounded-xl'>Enter Otp Send <span className='text-black font-bold text-xl'> {currentOrder.user.fullName}</span> </p>
         <input onChange={(e) => setOtp(e.target.value)}  value={otp} className='w-full border px-3 py-2 rounded-lg ' placeholder='enter otp' type="text" />
   
         <button onClick={verifyOtp} className='w-full py-1 rounded-xl mb-4 bg-green-400 text-white rounded-l font-semibold '>Submit OTP</button>
         
        </div> 
       }



       </div>
    </div>
  )
}

export default DelivaryDash






