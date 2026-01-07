import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { FaUtensils } from "react-icons/fa"
import axios from "axios"
import { serverUrl } from '../App'
import { setShopData } from '../redux/ownerSlice'
import { ClipLoader } from 'react-spinners'

const ItemEdit = () => {
    const navigate = useNavigate()
    const { shopData } = useSelector(state => state.owner)
    const {itemId} = useParams()

    const [currentItem, setCurrentItem] = useState(null)
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [frontImage, setFronImage] = useState( "")
    const [backImage, setBackImage] = useState( null)
    const [category, setCategory] = useState( "")
    const [foodType, setFoodType] = useState( currentItem?.foodtype || "Veg")
    const [laoding, setLoading] = useState(false)

    const categoryes = [
        "Snacks",
        "Main Course",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Bengali",
        "North Chittagonian",
        "Saudian",
        "Fast Food",
        "Others"
    ]

    const dispatch = useDispatch()

    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackImage(file)
        setFronImage(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("price", price)
            formData.append("category", category)
            formData.append("foodtype", foodType)
            

            if (backImage) {
                formData.append("image", backImage)
            }
            const result = await axios.post(serverUrl + `/api/item/edit-item/${itemId}`, formData, {
                withCredentials: true,
            })
            dispatch(setShopData(result.data))
            console.log(result.data)
            navigate("/")
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() =>{
       const fetchItembyid = async()=>{
        try {
            const result = await axios.get(serverUrl + `/api/item/get-item-byid/${itemId}`, {withCredentials: true})
             console.log(result.data)
            setCurrentItem(result.data)
        } catch (error) {
            console.log(error)
        }
       }
       fetchItembyid()
    }, [itemId])

    useEffect(() =>{
        setName(currentItem?.name ||"")
        setPrice(currentItem?.price || 0)
        setFronImage(currentItem?.image || "")
        setCategory(currentItem?.category || "")
        setFoodType(currentItem?.foodtype || "")

    }, [currentItem])

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
                        Edit Food
                    </div>
                </div>

                {/* form start now */}
                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* for name */}

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Name</label>
                        <input
                            onChange={(e) => setName(e.target.value)} value={name}
                            className='w-full px-4 py-2 border rounded-lg focus:outline focus:ring-2 focus:ring-orange-500' type="text" placeholder={`${name}`} />
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

                    {/* for price */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Price</label>
                        <input
                            onChange={(e) => setPrice(e.target.value)} value={price}
                            className='w-full px-4 py-2 border rounded-lg focus:outline focus:ring-2 focus:ring-orange-500' type="number" placeholder='0' />
                    </div>

                    {/* category */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Select Category</label>
                        <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-4 py-2 border rounded-lg focus:outline focus:ring-2 focus:ring-orange-500'>
                            <option value="">Select Category</option>
                            {categoryes.map((cat, index) => (
                                <option value={cat} key={index}>{cat}</option>
                            ))}
                        </select>

                    </div>
                    {/* food type */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Food Type</label>
                        <select onChange={(e) => setFoodType(e.target.value)} value={foodType} className='w-full px-4 py-2 border rounded-lg focus:outline focus:ring-2 focus:ring-orange-500'>
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                        </select>

                    </div>



                    <button className='w-full bg-orange-500 text-white px-6 rounded-lg font-semibold shadow-md hover:bg-orange-400 hover:shadow-lg transition-all py-3 cursor-pointer' disabled={laoding}>
                      {laoding ? <ClipLoader size={20} color='white' /> : "Edit Food"}
                    </button>
                </form>

            </div>

        </div>
    )
}

export default ItemEdit