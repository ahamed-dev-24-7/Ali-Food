import React from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setShopInMyCity, setItemInMyCity } from '../redux/userSlice'
function useGetItemByCity(){
    const disPatch = useDispatch()
    const {currentCity} = useSelector(state => state.user)
   useEffect(() =>{
    const fetchItem = async () =>{
      
        try {
            const result = await axios.get(serverUrl + `/api/item/get-by-city/${currentCity}`, {withCredentials: true})
            disPatch(setItemInMyCity(result.data))
            console.log(result.data)
            
        } catch (error) {
            console.log(error)
        }

    }
    fetchItem()
   }, [currentCity])
}

export default useGetItemByCity