import React from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders, setUserData } from '../redux/userSlice'
import { setShopData } from '../redux/ownerSlice'
function useGetMyOrders(){
    const disPatch = useDispatch()
    const {userData} = useSelector(state => state.user)
   useEffect(() =>{
    const fetchOrders = async () =>{
        try {
            const result = await axios.get(serverUrl + "/api/order/get-orders", {withCredentials: true})
            disPatch(setMyOrders(result.data))
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }
    fetchOrders()
   }, [userData]) 
}

export default useGetMyOrders