import React from 'react'
import { useSelector } from 'react-redux'
import UserDash from '../components/UserDash'
import OwnerDas from '../components/OwnerDas'
import DelivaryDash from '../components/DelivaryDash'
import Footer from '../components/Footer'

const Home = () => {
    const {userData } = useSelector(state => state.user)
  return (
    // <div className='w-[100vw] min-h-[100vs] pt-[100px] flex flex-col items-center  bg-[#fff9f6]'>
    <div>
      {userData?.role === "user" && <UserDash />}
      {userData?.role === "owner" && <OwnerDas />}
      {userData?.role === "delivaryBoy" && <DelivaryDash />} 
      <Footer />
    </div>
  )
}

export default Home