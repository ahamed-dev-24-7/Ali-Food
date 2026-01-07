import React from 'react'
import { useEffect } from 'react'
import axios from "axios"

import { useDispatch, useSelector } from 'react-redux'
import { setCurrCity, setCurrState, setCurrentAddrs } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useGetCity(){
    const disPatch = useDispatch()
    const {userData} = useSelector(state => state.user)

   useEffect(() =>{
        navigator.geolocation.getCurrentPosition(async (possition) =>{
            const latitude = possition.coords.latitude
            const longitude = possition.coords.longitude
            disPatch(setLocation({lat: latitude, lng: longitude}))
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEO_API_KEY}`)

            const city = result?.data.results[0].state_district
            // const state = result?.data.results[0].state
            const state = result?.data.results[0].state_district
            const currentAddress = result?.data.results[0].formatted
            console.log(result)
            disPatch(setCurrCity(city))
            disPatch(setCurrState(state))
            disPatch(setCurrentAddrs(currentAddress))
            console.log( result.data.results[0].state_district + ", " + result.data.results[0].formatted  )
            disPatch(setAddress(result?.data?.results[0].state_district + ", " + result?.data?.results[0].formatted ))
        })
   },[userData])
}

export default useGetCity