import React from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'

function useUpdateLocation(){
    const disPatch = useDispatch()
    const {userData} = useSelector(state => state.user)

   useEffect(() =>{
      const updateLocation = async (lat, lng) => {
        const result = await axios.post(`${serverUrl}/api/user/update-location`, {lat, lng}, {withCredentials: true})
        console.log(result.data)
      }
      navigator.geolocation.watchPosition((pos) => {
        updateLocation(pos.coords.latitude, pos.coords.longitude)
      })
   },[userData])
}

export default useUpdateLocation