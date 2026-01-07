import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import emailjs from "@emailjs/browser"
import { useSelector } from 'react-redux'
import { motion } from "framer-motion"
import Slidebar from '../components/Slidebar'
import { MdMessage } from "react-icons/md";
import { CiLocationArrow1 } from "react-icons/ci";
import { FaFacebook } from "react-icons/fa";
import { BiSolidContact } from "react-icons/bi";
import Footer from '../components/Footer'
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
const Contact = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const { slider } = useSelector(state => state.user)

  const handleEmailChange = (e) => {
    e.preventDefault()
    emailjs.send(
      "service_d14eidp",
      "template_ypphegg",
      {
        from_name: name,
        to_name: "ahammed",
        from_email: email,
        to_email: "ahammedarslan@gmail.com",
        message: message
      },
      "2FhGv4xUsPOSa-QUw"
    ).then(() => {
      alert("email js word"),
        setName(""),
        setEmail(""),
        setMessage("")
    }, (error) => {
      console.log(error)
    })
  }


  return (
    <div className=' bg-[#FCF8F8] min-w-[100%] min-h-[100vh]'>
      <Navbar />

      {/* slider */}
      {
        slider && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.2 }}
          >
            <div className='fixed  text-white mt-10 shadow-md shadow-white bg-[#F5F5F5] w-48 h-[90vh] z-10'>
              <Slidebar />
            </div>
          </motion.div>
        )
      }

      <div className='w-[80%] m-auto flex flex-col sm:flex-row items-center justify-center gap-30 bg-[#F8F5E9] inset-shadow-sm rounded-xl translate-y-20 p-10 mb-26'>

        <div>
          <h1 className='text-sm font-semibold text-gray-600'>We Are To Know Your Thoughts</h1>
          <h1 className='text-4xl font-bold text-[#5a7acd]'>Discuss Your Food <br /> Interest To Us</h1>
          <div className='mt-5'>
            <span className='flex text-md items-center gap-2 text-[#5a7acd]'><BiSolidContact className=' ' size={20} /> Contact : +8848554</span>
            <span className='flex text-md items-center gap-2 text-[#5a7acd]'><CiLocationArrow1 className='' size={20} /> Location : Everywhere</span>
            <span className='flex text-md items-center gap-2 text-[#5a7acd]'><MdMessage className='' size={20} /> Message : ahamed@gmail.com</span>
            <div>
              <h1 className='font-bold text-2xl '>Follow Us</h1>
              <ul className='flex items-center gap-2 mt-2 text-4xl'>
                <li><a href="https://www.linkedin.com/in/ahammed-hafij-ali-3919b2278/"><FaLinkedin /></a></li>
                <li><a href="https://www.facebook.com/ahammed.hafij.ali.2024"><FaFacebook /></a></li>
                <li><a href="https://github.com/AhammedWebPro"><FaGithub /></a></li>
                <li><a href=""><FaInstagram /></a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className='flex flex-col justify-center items-center bg-white'>
          <form onSubmit={handleEmailChange} className='flex flex-col  items-center justify-center p-12 gap-4 rounded-2xl shadow-lg shadow-gray-300'>
            <div className='flex flex-col'>
              <span>Name</span>
              <input className='border border-blue-400 px-10 py-2 rounded-xl' type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder='name' />
            </div>
            <div className='flex flex-col'>
              <span>Email</span>
              <input className='border border-blue-400 px-10 py-2 rounded-xl' type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='email' />
            </div>
            <div className='flex flex-col items-start justify-start'>
              <span>Message</span>
              <input type="text" className='border border-blue-400 px-10 py-2 rounded-xl' onChange={(e) => setMessage(e.target.value)} value={message} placeholder='message' />
            </div>
            <button className='bg-[#5a7acd] text-white font-semibold px-10 py-2 rounded-full shadow-lg shadow-gray-300' type="submit">Send</button>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Contact