import express from "express"

import { createAndEditShop, getAllShop, getShop, getShopByCity } from "../controller/shopController.js"
import isAuth from "../middleware/auth.js"
import { upload } from "../middleware/multer.js"

const shopRouter = express.Router()

 

shopRouter.post("/create-edit", isAuth , upload.single("image"), createAndEditShop)
shopRouter.get("/getshop", isAuth , getShop)
shopRouter.get("/getshopbycity/:city", isAuth , getShopByCity)
shopRouter.get("/getAllShop/", isAuth , getAllShop)


export default shopRouter