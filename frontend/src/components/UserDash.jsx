import React, { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import { categories } from '../assets/category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6"
import { useDispatch, useSelector } from 'react-redux'
import FoodCard from './FoodCard'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import Banner from './Banner'
import ShopCard from './ShopCard'
import Footer from './Footer'
import { asstes } from '../assets/assets'
import Testimonal from './Testimonal'
import { motion } from "framer-motion"


const UserDash = () => {

  const { currentCity, shopInMyCity, itemInMyCity, searchItem, slider, userData, allItem, allShop } = useSelector(state => state.user)
  const [showLeftBtn, setShowLeftBtn] = useState(false)
  const [showRightBtn, setShowRightBtn] = useState(false)
  const [showShopLeftBtn, setShopShowLeftBtn] = useState(false)
  const [showShopRightBtn, setShopShowRightBtn] = useState(false)
  const [updatedItemsList, setUpdatedItemsList] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // this is for category 
  const handleFilterbyCategory = (category) => {
    if (category === "All") {
      setUpdatedItemsList(itemInMyCity)
    } else {
      const filterdList = itemInMyCity?.filter(i => i.category === category)
      setUpdatedItemsList(filterdList)
    }
  }

  useEffect(() => {
    setUpdatedItemsList(itemInMyCity)
  }, [itemInMyCity])

  const categoryScrRef = useRef()
  const shopScrRef = useRef()


  const updateButtn = (ref, setLeftBtn, setRihtBtn) => {
    const element = ref.current
    if (element) {
      setShowLeftBtn(element.scrollLeft > 0)
      setShowRightBtn(element.scrollLeft + element.clientWidth < element.scrollWidth)
    }
  }

  const scrollHandleer = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth"
      })
    }
  }



  useEffect(() => {
    const categoryEl = categoryScrRef.current;
    const shopEl = shopScrRef.current;

    if (!categoryEl || !shopEl) return;

    const handleCategoryScroll = () => {
      setShowLeftBtn(categoryEl.scrollLeft > 0);
      setShowRightBtn(
        categoryEl.scrollLeft + categoryEl.clientWidth < categoryEl.scrollWidth
      );
    };

    const handleShopScroll = () => {
      setShopShowLeftBtn(shopEl.scrollLeft > 0);
      setShopShowRightBtn(
        shopEl.scrollLeft + shopEl.clientWidth < shopEl.scrollWidth
      );
    };

    handleCategoryScroll();
    handleShopScroll();

    categoryEl.addEventListener("scroll", handleCategoryScroll);
    shopEl.addEventListener("scroll", handleShopScroll);

    return () => {
      categoryEl.removeEventListener("scroll", handleCategoryScroll);
      shopEl.removeEventListener("scroll", handleShopScroll);
    };
  }, [shopInMyCity]);

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center overflow-y-auto'>
      <Navbar />

      {/* this is show up when people try to search something */}
      {searchItem && searchItem.length > 0 &&
        <div className='mt-20 w-fll max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl '>
          <h1 className='text-gray-800 text-2xl sm:text-3xl font-semibold border-b border-gray-200 '>Search results</h1>
          <div className='flex flex-wrap gap-6'>
            {searchItem.map((item) => (
              <FoodCard data={item} />
            ))}
          </div>
        </div>
      }


      {/* here is the banner  */}
      <Banner />


      <div className='mt-8 w-full max-w-6xl  gap-6 items-start p-[10px]'>
        <h1 className='text-gray-800  font-semibold mb-8 text-3xl'>Inspiration for you first order</h1>
        <motion.div
         initial={{opacity:0, y:-100}}
         whileInView={{ y:0, opacity:1}}
         viewport={{once: true, amount: 0.2}}
         transition={{duration: 0.8}}
        >
          <div className='w-full relative'>
          {/* left button */}
          {showLeftBtn &&
            <button>
              <FaCircleChevronLeft onClick={() => scrollHandleer(categoryScrRef, "left")} size={25} className='absolute left-0 text-[#5A7ACD] bg-white z-10 top-1/2 -translate-y-1/2 rounded-full hover:bg-black' />
            </button>
          }
          <div className='w-full flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb ' ref={categoryScrRef}>
            {categories.map((cat, index) => (
              <CategoryCard onClick={() => handleFilterbyCategory(cat.category)} name={cat.category} image={cat.image} key={index} />
            ))}

          </div>
          {/* right button */}
          {showRightBtn &&
            <button>
              <FaCircleChevronRight onClick={() => scrollHandleer(categoryScrRef, "right")} size={25} className='absolute right-0 text-[#5A7ACD] bg-white z-10 top-1/2 -translate-y-1/2 rounded-full hover:bg-black' />
            </button>
          }
        </div>
        </motion.div>

        {/* if there is any shop in your area then it will apear or not */}
        {
          shopInMyCity.length > 0 && (
            <div className='mt-14 w-full max-w-6xl  gap-6 items-start p-[10px]' >
              <h1 className='text-gray-800  font-semibold text-3xl mb-8'>Best shop in the <span className='font-semibold'> {currentCity}</span> </h1>
              <div className='w-full relative'>

                <div className='w-full flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb ' >
                  {shopInMyCity.map((shop, index) => (
                    <CategoryCard onClick={() => navigate(`/shop/${shop._id}`)} name={shop.name} image={shop.image} key={index} />
                  ))}

                </div>

              </div>
            </div>
          )
        }

        {/* now it will show those item whose are you city */}
       <motion.div
        initial={{opacity: 0, x: -100}}
        whileInView={{opacity: 1, x:0}}
        viewport={{once: true, amount: 0.2}}
        transition={{duration: 0.4}}
       >
         {
          updatedItemsList.length > 0 && (
            <div className='mt-14 w-full max-w-6xl  gap-6 items-start p-[10px]'>
              <h1 className='text-gray-800  font-semibold text-3xl mb-8'>Suggested food item</h1>

              <div className='w-full h-auto flex flex-wrap gap-20 justify-center'>
                {updatedItemsList?.map((item, index) => (
                  <FoodCard key={index} data={item} />
                ))}

              </div>

            </div>
          )
        }
       </motion.div>

        {/* best shop world wide */}

        <div className='mt-14 w-full max-w-6xl  gap-6 items-start p-[10px]' >
          <h1 className='text-gray-800  font-semibold text-3xl'>Best shop in the world wide </h1>
          <div className='w-full relative'>
            {/* left button */}
            {showShopLeftBtn &&
              <button>
                <FaCircleChevronLeft onClick={() => scrollHandleer(shopScrRef, "left")} size={40} className='absolute left-0 text-[#5A7ACD] bg-white z-10 top-1/2 -translate-y-1/2 rounded-full hover:bg-black' />
              </button>
            }
            <div className='w-full mt-8 flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb ' ref={shopScrRef}>
              {allShop.map((shop, index) => (
                <ShopCard onClick={() => navigate(`/shop/${shop._id}`)} name={shop.name} image={shop.image} key={index} />
              ))}

            </div>
            {/* right button */}
            {showShopRightBtn &&
              <button type='button'>
                <FaCircleChevronRight onClick={() => scrollHandleer(shopScrRef, "right")} size={40} className='absolute right-0 text-[#5A7ACD] bg-white z-10 top-1/2 -translate-y-1/2 rounded-full hover:bg-black' />
              </button>
            }
          </div>
         <div className='flex items-center justify-center'>
            <button onClick={() => {navigate("/all-shop"), window.scrollTo(0,0)}} className='py-1.5 px-7 bg-[#5A7ACD] text-white font-semibold text-xl rounded-xl shadow-lg hover:scale-110  transition-transform duration-200 shadow-[#5A7ACD]'>All Shop</button>
         </div>
        </div>


        {/* show all item */}
       <motion.div
         initial={{opacity:0, x: -100}}
         whileInView={{opacity: 1, x: 0}}
         viewport={{once: true, amount: 0.2}}
         transition={{duration: 0.4}}
       >
         <div className='mt-14 w-full max-w-6xl  gap-6 items-start p-[10px]'>
          <h1 className='text-gray-800 font-semibold text-3xl mb-9'>Best Food Right Now</h1>

          <div className='w-full h-auto flex flex-wrap gap-20 justify-center'>
            {allItem?.slice(0, 8).map((item, index) => (
              <FoodCard key={index} data={item} />
            ))}

          </div>

        </div>
       </motion.div>


        {/* discount card */}
      <motion.div
       initial={{opacity:0, y:-100}}
       whileInView={{opacity: 1, y:0}}
       viewport={{once: true, amount: 0.2}}
       transition={{duration:0.4}}
      >
          <div className='hidden sm:block max-h-[400px] discouont-img relative rounded-xl mt-6'>
          <div className='absolute inset-0 bg-black opacity-40 rounded-xl'></div>
            <img className='absolute z-10 -top-5 left-40 w-32' src={asstes.logo3} alt="" />
            <div className=' flex items-center justify-between'>
                <img className='absolute z-10 -top-5 left-40 w-32' src={asstes.logo3} alt="" />
             <div className='z-10 flex flex-col items-start translate-x-50'>
            <h1 className='font-bold text-yellow-500 text-6xl'>DELICIOUS <br /><span className='text-white'>BURGER</span></h1>
            <p className='font-semibold text-lg text-white mt-4'>There is a huge discount are available now!</p>
            <button onClick={() => {navigate("/all-food"); window.scrollTo(0,0)}} className='px-3 py-1 bg-[#5A7ACD] text-white font-semibold text-xl rounded-xl mt-5 hover:scale-110  transition-transform duration-200 shadow-[#5A7ACD]'>Order Now</button>
          </div>
            <img className='z-10 w-96' src={asstes.burger} alt="" />
          </div>
        </div>
      </motion.div>

        
        {/* testimoina */}
        <Testimonal />

        {/* this is conatact */}
        <motion.div
       initial={{opacity:0, x:-100}}
       whileInView={{opacity: 1, x:0}}
       viewport={{once: true, amount: 0.2}}
       transition={{duration:0.4}}
      >
        <div className='relative contact-img rounded-2xl mt-6'>
          <div className='absolute inset-0 bg-black opacity-50 rounded-2xl'></div>
           <div className='z-10 flex flex-col py-20 items-center justify-center'>
             <h1 className='z-10 text-white text-2xl text-center sm:text-4xl font-bold mb-4'>Share Your Thoughts To Us</h1>
            <button onClick={() => {navigate("/contact"); window.scrollTo(0, 0)}} className=' py-1 sm:py-2 z-10 px-5 sm:px-10 bg-[#5A7ACD] text-white font-semibold text-xl rounded-xl shadow-lg hover:scale-110  transition-transform duration-200 shadow-[#5A7ACD]'>Contact Now</button>
           </div>

        </div>

        </motion.div>

      </div>

   
    </div>
  )
}

export default UserDash