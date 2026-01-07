import React, { useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaUtensils } from "react-icons/fa"
import axios from "axios"
import { serverUrl } from '../App'
import { setShopData } from '../redux/ownerSlice'
import { ClipLoader } from 'react-spinners'

const CreateEditShop = () => {
    const navigate = useNavigate()
    const { shopData } = useSelector(state => state.owner)
    const { currentCity, currentState, currentAddress } = useSelector(state => state.user)

    const [name, setName] = useState(shopData?.name || "")
    const [city, setCity] = useState(shopData?.city || currentCity)
    const [state, setState] = useState(shopData?.state || currentState)
    const [address, setAddress] = useState(shopData?.address || currentAddress)
    const [frontImage, setFronImage] = useState(shopData?.image || null)
    const [backImage, setBackImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackImage(file)
        setFronImage(URL.createObjectURL(file))
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("city", city)
            formData.append("state", state)
            formData.append("address", address)
            if(backImage){
                formData.append("image", backImage)
            }
            const result = await axios.post(serverUrl + "/api/shop/create-edit", formData, {
                withCredentials: true,
            })
            dispatch(setShopData(result.data))
            console.log(result.data)
            navigate("/")
            setLoading(false)
        } catch (error) {
            console.log(error)
             setLoading(false)
        }
    }


    return (
        <div className=' flex justify-center items-center flex-col p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen    '>
            <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'>
                <IoIosArrowRoundBack onClick={() => navigate("/")} className='text-orange-500' size={35} />
            </div>
            <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
                <div className=' flex flex-col items-center mb-6'>
                    <div className='bg-orange-100 p-4 rounded-full mb-4'>
                        <FaUtensils className='text-orange-500 w-16 h-16' />

                    </div>

                    {/* create showp */}
                    <div className='text-3xl font-extrabold text-gray-500'>
                        {shopData ? "Edit Your Shop" : "Create Your Shop"}

                    </div>


                </div>

                {/* form start now */}
                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* for name */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Name</label>
                        <input
                            onChange={(e) => setName(e.target.value)} value={name}
                            className='w-full px-4 py-2 border rounded-lg focus:outline focus:ring-2 focus:ring-orange-500' type="text" placeholder='enter shop name' />
                    </div>
                    {/* for image */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Image</label>
                        <input
                            onChange={handleImage}
                            className='w-full px-4 py-2 border rounded-lg focus:outline focus:ring-2 focus:ring-orange-500' type="file" accept='/image/*' placeholder='enter shop image' />
                        {frontImage &&
                        
                        <div>
                            <img className='w-full h-48 object-cover rounded-lg' src={frontImage} alt="" />
                        </div>}
                    </div>
                    {/* for state and city */}
                    <div className='flex flex-col sm:flex-row items-center justify-between'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>State</label>
                            <input
                                onChange={(e) => setState(e.target.value)} value={state}
                                className='w-full px-4 py-2 border rounded-lg focus:outline focus:ring-2 focus:ring-orange-500' type="text" placeholder={`${state}`} />

                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 '>City</label>
                            <input
                                onChange={(e) => setCity(e.target.value)} value={city}
                                className='w-full px-4 py-2 border rounded-lg focus:outline focus:ring-2 focus:ring-orange-500' type="text" placeholder={`${city}`} />

                        </div>
                    </div>
                    {/* for addres */}
                    <div>
                        {/* <label className='block text-sm font-medium text-gray-700'>{address}</label> //try this and make some fun */}
                        <label className='block text-sm font-medium text-gray-700'>Address</label>
                        <input
                            onChange={(e) => setAddress(e.target.value)} value={address}
                            className='w-full px-4 py-2 border rounded-lg focus:outline focus:ring-2 focus:ring-orange-500' type="text" placeholder='enter shop address' />

                    </div>
                    <button  className='w-full bg-orange-500 text-white px-6 rounded-lg font-semibold shadow-md hover:bg-orange-400 hover:shadow-lg transition-all py-3 cursor-pointer' disabled={loading}>
                        {loading ? <ClipLoader size={20} color='white' /> : shopData ? "Edit Shop" : "Create Shop" }
                    </button>
                </form>

            </div>

        </div>
    )
}

export default CreateEditShop