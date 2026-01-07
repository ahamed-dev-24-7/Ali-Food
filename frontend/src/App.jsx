import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgetPass from './pages/ForgetPass'
import useGetCurrUser from './hooks/useGetCurrUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './hooks/useGetCity'
import useGetShop from './hooks/useGetShop'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import ItemEdit from './pages/ItemEdit'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetItemByCity from './hooks/useGetItemByCity'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'
import PlaceOrder from './pages/PlaceOrder'
import MyOrders from './pages/MyOrders'
import useGetMyOrders from './hooks/useGetMyOrders'
import useUpdateLocation from './hooks/userUpdateLocation'
import TrackOrderFUser from './pages/TrackOrderFUser'
import Shop from './pages/Shop'
import { io } from 'socket.io-client'
import { setSocket } from './redux/userSlice'
import "./App.css"
import ShopPage from './pages/ShopPage'
import AllFoodPage from './pages/AllFoodPage'
import useAllItem from './hooks/useAllItem'
import useAllShop from './hooks/useAllShop'
import Contact from './pages/Contact'


export const serverUrl = "https://ali-food-backend.onrender.com" 
 
const App = () => {

  const dispatch = useDispatch()

  useGetCurrUser()
  useGetCity()
  useGetShop()
  useGetShopByCity()
  useGetItemByCity()
  useGetMyOrders()
  useUpdateLocation()
  useAllItem()
  useAllShop()
  const {userData} = useSelector(state => state.user)

  // this is for socket io
  useEffect(() => {
    const socketInstance = io(serverUrl, {withCredentials: true})
    dispatch(setSocket(socketInstance))
    socketInstance.on('connect' , () => {
      if(userData){
        socketInstance.emit('identity', {userId: userData._id})
      }
    })

    return () => {
      socketInstance.disconnect()
    }

  }, [userData?._id])
  return (
    <Routes>  
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={"/"} /> } />
      <Route path='/forget-password' element={!userData ? <ForgetPass /> : <Navigate to={"/"} />} />
      <Route path='/' element={userData ?  <Home /> : <Navigate to={"/signin"} />} />
      <Route path='/create-edit-shop' element={userData ?  <CreateEditShop /> : <Navigate to={"/signin"} />} />
      <Route path='/add-food' element={userData ?  <AddItem /> : <Navigate to={"/signin"} />} />
      <Route path='/edit-item/:itemId' element={userData ?  <ItemEdit /> : <Navigate to={"/signin"} />} />
      <Route path='/cart' element={userData ?  <CartPage /> : <Navigate to={"/signin"} />} />
      <Route path='/checkout' element={userData ?  <CheckOut /> : <Navigate to={"/signin"} />} />
      <Route path='/place-order' element={userData ?  <PlaceOrder /> : <Navigate to={"/signin"} />} />
      <Route path='/my-orders' element={userData ?  <MyOrders /> : <Navigate to={"/signin"} />} />
      <Route path='/track-order/:orderId' element={userData ?  <TrackOrderFUser /> : <Navigate to={"/signin"} />} />
      <Route path='/shop/:shopId' element={userData ?  <Shop /> : <Navigate to={"/signin"} />} />
      <Route path='/all-shop' element={userData ?  <ShopPage /> : <Navigate to={"/signin"} />} />
      <Route path='/all-food' element={userData ?  <AllFoodPage /> : <Navigate to={"/signin"} />} /> 
      <Route path='/contact' element={userData ?  <Contact /> : <Navigate to={"/signin"} />} /> 

    </Routes>
  ) 
}

export default App
