import express from "express"


import isAuth from "../middleware/auth.js"
import { addItem, deleteItem, editItem, getAllItem, getItemByCity, getItemById, getItemsByShop, ratings, searchItem } from "../controller/itemController.js"
import { upload } from "../middleware/multer.js"

const itemRouter = express.Router()

 

itemRouter.post("/add-item", isAuth , upload.single("image"), addItem)
itemRouter.post("/edit-item/:itemId", isAuth , upload.single("image"), editItem)
itemRouter.get("/get-item-byid/:itemId", isAuth, getItemById)
itemRouter.get("/delete-item/:itemId", isAuth, deleteItem)
itemRouter.get("/get-by-city/:city", isAuth, getItemByCity)
itemRouter.get("/get-item-byshop/:shopId", isAuth, getItemsByShop)
itemRouter.get("/search-item", isAuth, searchItem)
itemRouter.post("/rating", isAuth, ratings)
itemRouter.get("/getAllItem", isAuth, getAllItem)


export default itemRouter