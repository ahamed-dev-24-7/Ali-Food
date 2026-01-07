import React from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setShopInMyCity } from '../redux/userSlice'
function useGetShopByCity(){
    const disPatch = useDispatch()
    const {currentCity} = useSelector(state => state.user)
   useEffect(() =>{
    const fetchShop = async () =>{
      
        try {
            const result = await axios.get(serverUrl + `/api/shop/getshopbycity/${currentCity}`, {withCredentials: true})
            disPatch(setShopInMyCity(result.data))
            console.log(result.data)
            
        } catch (error) {
            console.log(error)
        }

    }
    fetchShop()
   }, [currentCity])
}

export default useGetShopByCity