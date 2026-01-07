import Item from "../model/itemModel.js";
import Shop from "../model/shopModel.js";
import uplodadCloudinarImage from "../utils/cloudinary.js";


export const addItem = async (req, res) => {
    try {
        const { name, category, price, foodtype } = req.body
        let image;
        if (req.file) {
            image = await uplodadCloudinarImage(req.file.path)
        }
        const shop = await Shop.findOne({ owner: req.userId })
        if (!shop) {
            return res.status(400).json({ message: "shop not found" })
        }
        const item = await Item.create({
            name,
            category,
            image,
            price,
            foodtype,
            shop: shop._id
        })
        shop.items.push(item._id)
        await shop.save()
        await shop.populate("items owner")
        return res.status(201).json(shop)

    } catch (error) {
        return res.status(500).json({ message: "add itme error" + error })
    }
}


export const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const { name, category, price, foodtype } = req.body
        let image;
        if (req.file) {
            image = await uplodadCloudinarImage(req.file.path)
        }
        const item = await Item.findByIdAndUpdate(itemId, {
            name, category, price, foodtype, image
        }, { new: true })
        if (!item) {
            return res.status(400).json({ message: "item not found" })
        }
        const shop = await Shop.findOne({ owner: req.userId }).populate("items")

        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({ message: "edit itme error" + error })
    }
}

export const getItemById = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findById(itemId)
        if (!item) {
            return res.status(400).json({ message: "item not fouond" })
        }
        return res.status(200).json(item)
    } catch (error) {
        return res.status(400).json({ message: error })
    }
}

export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findByIdAndDelete(itemId)
        if (!item) {
            return res.status(400).json({ message: "item not fouond" })
        }
        const shop = await Shop.findOne({ owner: req.userId })
        shop.items = shop.items.filter(i => i.toString() !== item.id.toString())
        await shop.save()
        await shop.populate("items owner")
        return res.status(200).json(shop)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error })
    }
}


export const getItemByCity = async (req, res) => {
    try {
        const { city } = req.params
        if (!city) {
            return res.status(400).json({ message: "city is required" })

        }
        const shop = await Shop.find({
        city: {$regex: new RegExp(`${city}$`, "i")}
        }).populate("owner items")
        if(!shop){
            return res.status(404).json({message: "shop not found"})
        }

        const shopIds = shop.map((shop) => shop._id)

        const items = await Item.find({shop: {$in: shopIds}})

        return res.status(200).json(items)

    } catch (error) {
        return res.status(500).json({message: "cant find the items"})
    }
}

// this si for user to get the shop all informaito when click any perticular shop
export const getItemsByShop = async (req, res) => {
    try {
        const {shopId} = req.params
        const shop = await Shop.findById(shopId).populate("items")
        if(!shop){
            return res.status(400).json({message: "shop not fouond"})
        }
        return res.status(200).json({
            shop, items: shop.items
        })
    } catch (error) {
        return res.status(400).json({message: `${error} you got an error in getshopbyid`})
    }
}


// this is search 
export const searchItem = async (req, res) => {
    try {
        const {query, city} = req.query

        if(!query || !city){
            return null
        }

         const shops = await Shop.find({
            city: { $regex: city, $options: "i" }
        }).populate("owner items")
        if (shops.length === 0) {
            return res.status(404).json({ message: "no shops found" });
        }

        const shopId = shops.map(s => s._id)
        const items = await Item.find({
            shop: {$in: shopId},
            $or: [
                {name: {$regex: query, $options: "i"}},
                {category: {$regex: query, $options: "i"}}
            ]
        }).populate("shop", "name image")
        return res.status(200).json(items)
    } catch (error) {
         return res.status(400).json({message: `${error} you got an error in search search`})
    }
}


export const ratings = async(req, res) => {
    try {
        const {itemId, rating} = req.body
        if(!itemId || !rating){
               return res.status(500).json({message: `itemid/rating not fouond`})
        }

        if(rating < 1 || rating > 5){
            return res.status(500).json({message: `rating must be beetwin 1 - 5`})
        }
        
        const item = await Item.findById(itemId)
        if(!item){
            return res.status(500).json({message: `item not found`})
        }

        const newCount = item.rating.count + 1
        const newAverage =( item.rating.average * item.rating.count + rating) / newCount
        item.rating.count = newCount
        item.rating.average = newAverage
        await item.save()
        return res.status(200).json({rating: item.rating})



        
    } catch (error) {
         return res.status(500).json({message: `rataing problem ${error}`})
    }
}

export const getAllItem = async(req, res) => {
    try {
        const item = await Item.find()
        if(!item){
            return res.status(400).json({message: "item not found"})
        }
        return res.status(200).json(item)
    } catch (error) {
         return res.status(500).json({message: `get all item  problem ${error}`})
    }
}