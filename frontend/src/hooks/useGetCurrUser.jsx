import React from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
function useGetCurrUser(){
    const disPatch = useDispatch()
   useEffect(() =>{
    const fetchUser = async () =>{
        try {
            const result = await axios.get(serverUrl + "/api/user/currentuser", {withCredentials: true})
            disPatch(setUserData(result.data))
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }
    fetchUser()
   }, [])
}

export default useGetCurrUser

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { serverUrl } from '../App';
// import { useDispatch } from 'react-redux';
// import { setUserData } from '../redux/userSlice';

// function useGetCurrUser() {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const result = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true });
//         dispatch(setUserData(result.data));
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   return loading;
// }
// function useGetCurrUser() {
//   const dispatch = useDispatch()
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(
//           serverUrl + "/api/user/currentuser",
//           { withCredentials: true }
//         )
//         dispatch(setUserData(res.data))
//       } catch (error) {
//         console.log(error)
//       } finally {
//         setLoading(false)   // ✅ ALWAYS runs
//       }
//     }

//     fetchUser()
//   }, [])

//   return loading
// }

// export default useGetCurrUser;
