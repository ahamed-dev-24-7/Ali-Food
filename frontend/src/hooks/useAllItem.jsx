 import React from 'react'
 import { useEffect } from 'react'
 import axios from "axios"
 import { serverUrl } from '../App'
 import { useDispatch, useSelector } from 'react-redux'
import { setAllItem } from '../redux/userSlice'

 function useAllItem(){
     const disPatch = useDispatch()
     const {allItem} = useSelector(state => state.user)
    useEffect(() =>{
     const fetchShop = async () =>{
       
         try {
           const result = await axios.get(`${serverUrl}/api/item/getAllItem`, { withCredentials: true })
             disPatch(setAllItem(result.data))
             console.log(result.data)
             console.log("hi")
             
         } catch (error) { 
             console.log(error)
         }
  
     }
     fetchShop()
    }, [])
 }

 export default useAllItem