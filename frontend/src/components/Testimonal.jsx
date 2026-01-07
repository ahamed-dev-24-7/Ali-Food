import React, { useState } from 'react'
import { IoMdStarOutline } from "react-icons/io";
import {Swiper, SwiperSlide} from "swiper/react"
import {Autoplay, Pagination} from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { testimonials } from '../assets/assets';


const Testimonal = () => {

  return (
    <div className='bg-[#e9e5e5] mt-6 rounded-xl py-6'>   
        <h1 className='text-center text-3xl font-bold mb-2'>Read reivews <br /> <span className='text-[#5a6acd]'>ride with confidence.</span></h1>
        <p className='flex items-center justify-center mb-6'>4.2/5 <IoMdStarOutline className='text-[#5a6acd]' /> &nbsp;Trustpilot Based on 5210 reviews</p>

        <Swiper
         modules={[Autoplay, Pagination]}
         spaceBetween={30}
         breakpoints={{
            0: {slidesPerView: 1},
            768: {slidesPerView: 2}
         }}
         autoplay={{delay: 5000}}
         pagination={{clickable:true}}
         loop={true}
         className='testimonial-slider'
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card px-4 bg-white rounded-2xl flex flex-col max-w-[400px] m-auto items-center justify-center ">
                 <h3 className='text-xl font-semibold'>{testimonial.name}</h3>
                <p className='text-lg font-extralight'>{testimonial.role}</p>
                <p className='text-center text-gray-700 font-light'>{testimonial.text}</p>
                 <img className='w-28 mt-5 mb-2' src={testimonial.image} alt={testimonial.name} />
                </div>

            </SwiperSlide>
          ))}
        </Swiper>


    </div>
  )
}

export default Testimonal