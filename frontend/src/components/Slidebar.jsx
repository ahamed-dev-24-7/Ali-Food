import React from 'react'
import { FaHome } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { CiShop } from "react-icons/ci";
import { MdOutlineContactPhone } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { asstes } from '../assets/assets';

const Slidebar = () => {
 const navigate = useNavigate()
    const sidebar = [
        {name: "Home", image: FaHome, path: "/"},
        {name: "Food Item", image: AiFillProduct, path: "/all-food"},
        {name: "Shop", image: CiShop, path: "/all-shop"},
        {name: "Contact", image: MdOutlineContactPhone, path: "/contact"},
    ]

   
 
  return (
    <div>      
         <img src={asstes.logo3} className='w-32' onClick={() => navigate("/")} alt="" />
        
         <div  className='w-[80%] m-auto flex flex-col gap-4'>
             {sidebar.map((s, i) => (
            <div onClick={() => navigate(s.path)} key={i} className='border cursor-pointer border-black bg-black shadow-md shadow-white  rounded-xl py-1 px-2 flex items-center justify-between gap-2 hover:bg-white hover:text-black transition-transform duration-200 hover:border-blue-400'>
                 <h1 className='font-semibold text-lg'>{s.name}</h1>
                 <s.image />
            </div>
            ))}
         </div>
    </div>
  )
}
 
export default Slidebar