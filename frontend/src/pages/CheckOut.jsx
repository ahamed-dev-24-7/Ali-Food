import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io"
import { IoLocationSharp, IoServerSharp } from "react-icons/io5"
import { TbCurrentLocation } from "react-icons/tb"
import { IoSearch } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import { useSelector } from 'react-redux'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch } from "react-redux"
import {MdDeliveryDining} from "react-icons/md"
import {FaCreditCard} from "react-icons/fa"
import {FaMobileScreenButton} from "react-icons/fa6"
import { setAddress, setLocation } from '../redux/mapSlice'
import axios from 'axios'
import { serverUrl } from '../App'
import { addMyOrderRefresh } from '../redux/userSlice'
import Footer from '../components/Footer'






function ReCenterMap({ location }) {
  if (location.lat && location.lng) {
    const map = useMap()
    map.setView([location.lat, location.lng], 16, { animate: true })
  }

  return null

}


const CheckOut = () => {

  const { location, address } = useSelector(state => state.map)
  const { cartItems , totalAmount, userData} = useSelector(state => state.user)
  const [addressInput, setAddressInput] = useState("")
  const [paymentMethode, setPapymentMethode] = useState("cod")
  const dispatch = useDispatch()

 const deliveryFee = totalAmount > 500 ? 0 : 60
 const totalAmounWithDelivery = totalAmount + deliveryFee


  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lng }))
    getAddressByLatLng(lat, lng)
  }

  const getAddressByLatLng = async (lat, lng) => {
    try {

      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${import.meta.env.VITE_GEO_API_KEY}`)
      //  console.log(result?.data?.results[0].formatted)
      dispatch(setAddress(result?.data?.results[0].formatted))
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentLocation = () => {
      const latitude = userData.location.coordinates[1]
      const longitude = userData.location.coordinates[0]
      console.log(userData)
      dispatch(setLocation({lat:latitude, lng: longitude}))
      getAddressByLatLng(latitude, longitude)

}


const getLatLngByAddress = async() => {

try {
  const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${import.meta.env.VITE_GEO_API_KEY}`)
  console.log(result.data.features[0].properties.lat)
  console.log(result.data.features[0].properties.lon)
  dispatch(setLocation({lat:result.data.features[0].properties.lat, lng: result.data.features[0].properties.lon}))
} catch (error) {
  console.log(error)
}

}

 
const handlePlaceOrder = async () =>{
  try {
    const result = await axios.post(`${serverUrl}/api/order/placeorder`, {
      paymentMethode,
      deliveryAddress: {
        text: addressInput,
        latitude: location.lat,
        longitude: location.lng
      },
      totalAmount,
      cartItems
    }, {withCredentials: true})
    navigate("/place-order")
    console.log(result)
    dispatch(addMyOrderRefresh(result.data))
  } catch (error) {
    console.log(error)
  }
}


useEffect(() =>{
  setAddressInput(address)
}, [address]) 

const navigate = useNavigate()


return (
 <>
  <div className='min-h-screen bg-white flex items-center justify-center'>
    <div className='flex items-center gap-20 mb-6 '>
      <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'>
        <IoIosArrowRoundBack onClick={() => navigate("/")} className='text-orange-500' size={35} />
      </div>
    </div>

    <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6'>
      <h1 className='font-bold text-2xl'>Check Out </h1>
      <section className=''>
        <h2 className=' flex items-center text-sm mt-2 font-semibold'> <IoLocationSharp className='text-orange-400' /> Delivary Location </h2>
        {/* for location */}
        <div className='flex gap-2 mb-3 '>
          <input onChange={(e) => setAddressInput(e.target.value)} value={addressInput} className='flex-1 border p-2 mt-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400' placeholder='enter your location' type="text" />
          <button onClick={getLatLngByAddress} className='bg-orange-400 hover:bg-orange-600 text-white px-3 py-3 rounded-lg flex items-center justify-center'><IoSearch /></button>
          <button onClick={getCurrentLocation} className='bg-blue-400 hover:bg-blue-600 text-white px-3 py-3 rounded-lg flex items-center justify-center'> <TbCurrentLocation  /></button>
        </div>


        <div className='rounded-xl border overflow-hidden'>
          <div className='h-64 w-full flex items-center justify-center'>
            <MapContainer
              className={`w-full h-full `}
              center={[location?.lat, location?.lng]}
              zoom={16}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ReCenterMap location={location} />
              <Marker
                position={[location?.lat, location?.lng]}
                draggable
                eventHandlers={{ dragend: onDragEnd }} />


            </MapContainer>

          </div>


        </div>
      </section>

      <section>
        <h1 className='text-lg font-semibold text-gray-800'>Payment Method</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* cod */}
          <div onClick={() => setPapymentMethode("cod")} className={`flex py-2 items-center gap-5 rounded-xl ${paymentMethode === "cod" ? "border-orange-400 bg-orange-50 shadow" : "border-gray-50"} hover:border-gray-300`}>
             <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
              <MdDeliveryDining />
      
             </span>
             <div>
              <p className='font-medium text-gray-800'>Cash on delivery</p>
              <p className='text-xs text-gray-500'>Pay when your food arrives</p>
             </div>

        </div>
        
        {/* oncline methode */}
        <div onClick={() => setPapymentMethode("online")} className={`flex py-2 gap-5 items-center rounded-xl ${paymentMethode === "online" ? "border-orange-400 bg-orange-50 shadow" : "border-gray-50"} hover:border-gray-300`}>
            <span  className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
             <FaMobileScreenButton />
            </span>
            <span  className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-lg'>
              <FaCreditCard />
            </span>
             <div>
              <p className='font-medium text-gray-800'>Bkash / Credit / Dedit Card</p>
              <p className='text-xs text-gray-500'>Pay Online</p>
             </div>
        </div>
        </div>


      </section>


      {/* order summery  */}
      <section >
        <h2 className='text-lg font-semibold mb-3 text-gray-800'>Order Summery </h2>
         <div className='rounded-xl border bg-cyan-50 space-y-2'>
          {cartItems.map((item, index) => (
            <div key={index} className='flex px-2 py-3 justify-between text-sm'>
              <span>{item.name} x {item.quantity}</span> 
              <span>{item.price * item.quantity}</span>

            </div>
          ))}
          <hr className='border-gray-300 my-2'/>
           
           <div className='flex justify-between px-2'>
            <span className='font-semibold'>Subtotal </span>
            <span className='text-green-800'>{totalAmount}</span>
           </div>

           <div className='flex justify-between px-2'>
            <span>Delivery Fee</span>
            <span className='mb-2'>{deliveryFee == 0 ? "Free" : deliveryFee}</span>
           </div>

            <hr className='border-gray-300 my-2'/>

            <div className='flex justify-between px-2'>
              <span className=' font-bold '>Total Bill</span>
              <span className='text-green-900 font-semibold'>{totalAmounWithDelivery}</span>
            </div>

         </div>
      </section>

      <button onClick={handlePlaceOrder} className='w-full py-2 mt-2 bg-[#5A7ACD] text-white rounded-xl font-semibold  '>{paymentMethode == "cod" ? "Place Order" : "Pay & Place"}</button>

    </div>

 
  </div>
    <Footer />
 </>
)
}

export default CheckOut