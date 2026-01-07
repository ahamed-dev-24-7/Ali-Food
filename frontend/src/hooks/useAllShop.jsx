  import React from 'react'
 import { useEffect } from 'react'
 import axios from "axios"
 import { serverUrl } from '../App'
 import { useDispatch, useSelector } from 'react-redux'
import { setAllShop } from '../redux/userSlice'

 function useAllShop(){
     const disPatch = useDispatch()
     const {allShop} = useSelector(state => state.user)
    useEffect(() =>{
     const fetchShop = async () =>{
       
         try {
           const result = await axios.get(`${serverUrl}/api/shop/getAllShop`, { withCredentials: true })
             disPatch(setAllShop(result.data))
             console.log(result.data)
             console.log("hi")
             
         } catch (error) { 
             console.log(error)
         }
  
     }
     fetchShop()
    }, [])
 }

 export default useAllShop