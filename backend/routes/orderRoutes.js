import express from "express"
import isAuth from "../middleware/auth.js"
import { acceptOrder, deliveryBoyEarnings, getCureentOrder, getDeliveryBoyAssignment, getMyOrders,  getOrderById,  placeOrder, sendDeliveryOtp, updateOrderStatus, verifyDBOtp } from "../controller/orderController.js"

const orderRoutes = express.Router()

orderRoutes.post("/placeorder", isAuth, placeOrder)
orderRoutes.get("/get-orders", isAuth, getMyOrders)
orderRoutes.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus)
orderRoutes.get("/getDeliveryBoyAssignment", isAuth, getDeliveryBoyAssignment)
orderRoutes.get("/accept-order/:assignmentId", isAuth, acceptOrder)
orderRoutes.get("/get-current-orders/", isAuth, getCureentOrder)
orderRoutes.get("/get-orders-byid/:orderId", isAuth, getOrderById)
orderRoutes.post("/send-dliveryotp", isAuth, sendDeliveryOtp)
orderRoutes.post("/verify-delivery-otp", isAuth, verifyDBOtp)
orderRoutes.get("/get-today-deliveries", isAuth , deliveryBoyEarnings)

export default orderRoutes