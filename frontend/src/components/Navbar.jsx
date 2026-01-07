import React, { useState } from 'react'
import { FaLocationDot } from "react-icons/fa6"
import { IoIosSearch } from "react-icons/io"
import { FiShoppingCart } from "react-icons/fi"
import {  RxCross2 } from "react-icons/rx"
import {  FaPlus } from "react-icons/fa6"
import {  TbReceipt2 } from "react-icons/tb"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setSearchItem, setSlider, setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { IoMdMenu } from "react-icons/io";
import { asstes } from '../assets/assets'

const Navbar = () => {
   const primaryColour = "#5A7ACD";
    const { userData , currentCity, cartItems, slider} = useSelector(state => state.user)
    const {shopData} = useSelector(state => state.owner)
    const [showPopUp, setShowPopUp] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [query, setQuery] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // this for logout 
    const handleLogOut = async()  =>{
      try {
         const result = await axios.get(serverUrl + "/api/auth/signout", {withCredentials: true})
         dispatch(setUserData(null))
      } catch (error) {
         console.log(error)
      }
    }

    // thisis fof search
    const handleSearchItems = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/item/search-item?query=${query}&city=${currentCity}`, {withCredentials: true})
        dispatch(setSearchItem(result.data))
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      if(query){
        handleSearchItems()
      }else{
          dispatch(setSearchItem(null))
      }
    }, [query])

    return (
        <div className='w-full h-[60px] flex items-center justify-between md:justify-center gap-[30px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible'>

            {/* this search actually for samll device , it's  only apear  in the small deviece */}
            {showSearch && userData.role == "user" && <div className='md:w-[68%] lg:w-[40%] h-[70px] bg-white shadow-lg rounded-lg items-center gap-[20px] flex fixed top-[60px] left-[5%] md:hidden'>
                {/* for city */}
                <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                    <FaLocationDot size={25} className='text-[#5A7ACD]' />
                    <div className='w-[80%] truncate text-gray-600'>
                         {currentCity || "Detecting..."}
                    </div>

                </div>
                {/* for search */}
                <div className='w-[80%] flex items-center gap-[10px]'>
                    <IoIosSearch size={25} className='text-[#5A7ACD]' />
                    <input onChange={(e) => setQuery(e.target.value)} value={query} type="text" className='px-[10px] text-gray-700 outline-0 w-full' placeholder='search food' />
 
                </div>
            </div>  }

           {/* menu bar */}
           <div>
            <IoMdMenu onClick={() => dispatch(setSlider(!slider))} className='text-[#5A7ACD]' size={35} />
           </div>

            <img className='w-32 cursor-pointer' onClick={() => navigate('/')} src={asstes.logo3} alt="" />


            {/* thisis is for cityt and the search */}
            {userData.role == "user" &&
            <div className='md:w-[68%] lg:w-[40%] h-[70px] bg-white shadow-lg rounded-lg items-center gap-[20px] hidden md:flex'>
                {/* for city */}
                <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                    <FaLocationDot size={25} className='text-[#5A7ACD]' />
                    <div className='w-[80%] truncate text-gray-600'>
                        {currentCity || "Detecting..."}
                    </div>

                </div>
                {/* for search */}
              
                <div className='w-[80%] flex items-center gap-[10px]'>
                    <IoIosSearch size={25} className='text-[#5A7ACD]' />
                    <input onChange={(e) => setQuery(e.target.value)} value={query} type="text" className='px-[10px] text-gray-700 outline-0 w-full' placeholder='search food' />

                </div>
               
            </div>
            }


            {/* this is for cart and profile icon */}
            <div className='flex items-center gap-5'>
                { 
                userData.role == "user" &&
                   ( showSearch ? <RxCross2 size={25} className='text-[#5A7ACD]' onClick={()=> setShowSearch(false)}  /> : <IoIosSearch onClick={()=> setShowSearch(true)} size={25} className='text-orange-500 md:hidden' />)
                }


             {/* we will show the owner to add the item for here */}
             {userData.role == "owner" ?
              <>
              { shopData && 
                 <button onClick={()=> navigate("add-food")} className='flex items-center gap-1 px-2 py-1 cursor-pointer bg-[#ff4d2d]/10 text-orange-500 rounded-lg'>
                <FaPlus className=' text-[#5A7ACD]' size={25} /> 
                <span className='hidden md:flex text-[#5A7ACD]'>Add Item</span>
                </button>
              }
             
          
                <div onClick={() => navigate("/my-orders")} className='relative flex items-center gap-1 px-2 py-1 cursor-pointer bg-[#ff4d2d]/10 text-orange-500 rounded-lg'> 
               <TbReceipt2 className='text-[#5A7ACD]' size={25}  />
                 <span className='hidden md:flex text-[#5A7ACD]'>My Orders</span>
                 {/* <span className='absolute -right-2 -top-2 text-sm font-bold text-white bg-orange-500 rounded-full px-[6px] py-[1px] '>0</span> */}
               </div>
           
              </>
              : (
                <>
                {userData.role == "user" && 
                <div className='relative cursor-pointer'>
                    <FiShoppingCart onClick={() => {navigate("/cart"); window.scrollTo(0,0)}} size={25} className='text-[#5A7ACD]' />
                <span className='absolute right-[-9px] top-[-12px] text-[#5A7ACD]'>{cartItems.length}</span>

                </div>
                }


                <button onClick={() => {navigate("/my-orders"); window.scrollTo(0,0)}} className='hidden md:block px-3 py-1 rounded-lg bg-[#BDE8F5] text-cyan-800 font-bold text-sm  '>My Orders</button>

                
                </>
              )
             }

                
             
                

                <div onClick={() => setShowPopUp(!showPopUp)} className='w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#5A7ACD] text-white shadow-xl font-semibold cursor-pointer '>
                    {userData?.fullName.slice(0, 1)}

                </div>

                <div className={` ${showPopUp ? `fixed top-[70px]  w-[180px] bg-white shadow-2xl rounded-xl p-[20px]  flex flex-col gap-[10px] z-[9999] ${userData.role == "delivaryBoy" ? "right[10px] md:right-[20%] lg:right-[30%] " : "right[10px] md:right-[15%] lg:right-[10%] "}` : "hidden"} `}>
                    <div className='text-[17px] font-semibold '>{userData?.fullName}</div>
                   {userData?.role == "user" &&
                    <div onClick={() => navigate("/my-orders")} className='md:hidden text-orange-500 font-semibold cursor-pointer'>My Orders</div>
                   }
                    <div onClick={handleLogOut} className='text-orange-500 font-semibold cursor-pointer'>Log Out</div>
                </div>


            </div>
        </div>

    )
}

export default Navbar

