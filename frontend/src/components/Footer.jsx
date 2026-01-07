import React from 'react'
import { asstes } from '../assets/assets'
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
const Footer = () => {
  return (
   <div className='w-full bg-[#5a7acd] '>
      <div className='flex flex-col gap-10 sm:gap-0 sm:flex-row w-full p-10  text-white items-start sm:items-center justify-between'>

          <div className='flex flex-col items-start'>
            <img className='w-32' src={asstes.logo} alt="" />
            <h1 className='font-bold text-4xl flex flex-col items-center'>Ali-Food <br /> <span className='text-sm'>Best In Here</span></h1>

        </div>
        <div>
            <h1 className='font-bold text-2xl '>Services</h1>
            <ul>
                <li><a href="#">Delivery</a></li>
                <li><a href="#">Pickup</a></li>
                <li><a href="#">Dine-in</a></li>
            </ul>

        </div>
        <div>
            <h1  className='font-bold text-2xl '>Contact With Us</h1>
            <div>
                <span>Call: +92 300 1234567</span>
            </div>
            <div>
                <span>Email: ali@food.com</span>
            </div>
            <div>
                <span>Go To Contact Page</span>
            </div>

        </div>
        <div>
            <h1  className='font-bold text-2xl '>Follow Us</h1>
            <ul className='flex items-center gap-2 mt-2 text-4xl'>
                <li><a href="https://www.linkedin.com/in/ahammed-hafij-ali-3919b2278/"><FaLinkedin /></a></li>
                <li><a href="https://www.facebook.com/ahammed.hafij.ali.2024"><FaFacebook /></a></li>
                <li><a href="https://github.com/AhammedWebPro"><FaGithub /></a></li>
                <li><a href=""><FaInstagram /></a></li>
            </ul>
        </div>
   
      
    </div>
    <div className='w-full bg-[#061E29] text-white py-2'>
        <h1 className='text-center'>© 2024 Ali-Food. All rights reserved.</h1>
    </div>
   </div>
  )
}

export default Footer