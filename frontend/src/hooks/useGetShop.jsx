import React from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { setShopData } from '../redux/ownerSlice'
function useGetShop(){
    const disPatch = useDispatch()
    const {userData} = useSelector(state => state.user)
   useEffect(() =>{
    const fethShop = async () =>{
        try {
            const result = await axios.get(serverUrl + "/api/shop/getshop", {withCredentials: true})
            disPatch(setShopData(result.data))
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }
    fethShop()
   }, [userData]) 
}

export default useGetShop