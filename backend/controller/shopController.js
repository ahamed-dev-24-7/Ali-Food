import Shop from "../model/shopModel.js";
import uplodadCloudinarImage from "../utils/cloudinary.js";

export const  createAndEditShop = async (req, res) =>{
    try {
        const {name, city, state, address  } = req.body
        let image;
        if(req.file){
            image = await uplodadCloudinarImage(req.file.path)
        }
        console.log(req.file)
        console.log(req.body)
        console.log("User ID:", req.userId);


        let shop = await Shop.findOne({owner: req.userId})
        if(!shop){
            shop = await Shop.create({
            name,
            image,
            city,
            state,
            address,
            owner: req.userId
           
        })
        }else{
             shop = await Shop.findByIdAndUpdate(shop._id,{
            name,
            image,
            city,
            state,
            address,
            owner: req.userId
        
        }, {new: true})
        }
       
        await shop.populate("owner items")
        return res.status(201).json(shop)
    } catch (error) {
        // console.log(error)
        return res.status(500).json({message: `create shop error ${error}`})
    }
}


export const getShop = async(req, res) =>{
    try {
        const shop = await Shop.findOne({owner: req.userId}).populate("owner items")
        if(!shop){
            return null
        }
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({message: `cant find the shop ${error}`})
    }
} 

export const getShopByCity = async (req, res) =>{
    try {
        const {city} = req.params
        console.log(city)
        const shop = await Shop.find({
            // city: {$regex: new RegExp(`${city}$`, "i")}
            // city: {$regex: new RegExp(city, "i")}
            city: { $regex: city, $options: "i" }
        }).populate("owner items")
        // if(!shop){
        //     return res.status(404).json({message: "shop not found"})
        // }
        if (shop.length === 0) {
    return res.status(404).json({ message: "no shops found" });
}

        return res.status(200).json(shop)

    } catch (error) {
             return res.status(500).json({message: `cant find the shop ${error}`})
    }
}

export const getAllShop = async (req, res) => {
    try {
        const shop = await Shop.find().populate("owner items")
        if(!shop){
            return null
        }
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({message: `cant find  shop ${error}`})
    }
}