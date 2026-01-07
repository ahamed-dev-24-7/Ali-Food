import DeliveryAssignment from "../model/deliveryAssingModel.js"
import Order from "../model/orderModel.js"
import Shop from "../model/shopModel.js"
import User from "../model/userModel.js"
import { sendDeliveryOtpMail } from "../utils/mail.js"


export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethode, deliveryAddress, totalAmount } = req.body
        if (cartItems.length === 0 || !cartItems) {
            return res.status(400).json({ message: "Cart is empty" })
        }
        if (!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude) {
            return res.status(400).json({ message: "Give complete delivery address" })
        }

        const groupItemShop = {}

        cartItems.forEach(item => {
            const shopId = item.shop
            if (!groupItemShop[shopId]) {
                groupItemShop[shopId] = []
            }
            groupItemShop[shopId].push(item)


        })

        const shopOrders = await Promise.all(Object.keys(groupItemShop).map(async (shopId) => {
            const shop = await Shop.findById(shopId).populate("owner")
            // if (!shop) {
            //     return res.status(400).json({ message: "shop empty" })
            // }
            if (!shop) {
                throw new Error(`Shop with ID ${shopId} not found`)
            }
            if (!shop.owner) {
                throw new Error(`Shop owner missing for shop ID ${shopId}`)
            }

            const items = groupItemShop[shopId]
            const subTotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
            return {
                shop: shop._id,
                owner: shop.owner._id,
                subTotal,
                shopOrderItems: items.map((item) => ({
                    item: item.id,
                    price: item.price,
                    quantity: item.quantity,
                    name: item.name
                }))
            }


        }))


        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod: paymentMethode,
            deliveryAddress: deliveryAddress,
            totalAmount: totalAmount,
            shopOrders: shopOrders
        })

        await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")

        //    this is for socket io
        await newOrder.populate("shopOrders.owner", "name socketId")
        await newOrder.populate("user", "name email mobile")

        const io = req.app.get('io')
        if (io) {
            newOrder.shopOrders.forEach(shopOrder => {
                const ownerScoketId = shopOrder.owner.socketId
                if (ownerScoketId) {
                    io.to(ownerScoketId).emit('newOrder', {
                        _id: newOrder._id,
                        paymentMethod: newOrder.paymentMethod,
                        user: newOrder.user,
                        shopOrders: shopOrder,
                        createdAt: newOrder.createdAt,
                        deliveryAddress: newOrder.deliveryAddress
                    })
                }
            })
        }

        return res.status(201).json(newOrder)

    } catch (error) {
        return res.status(500).json({ message: `${error.message} you got error in place order` })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (user.role == "user") {
            const orders = await Order.find({ user: req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.owner", "name email mobile ")
                .populate("shopOrders.shopOrderItems.item", "name  price image")
            return res.status(200).json(orders)
        }
        else if (user.role == "owner") {
            const orders = await Order.find({ "shopOrders.owner": req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("user")
                .populate("shopOrders.shopOrderItems.item", "name  price image")
                .populate("shopOrders.assignedDeliveryBoys", "fullName mobile")

            const filterOrder = orders.map((order => ({
                _id: order._id,
                paymentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                createdAt: order.createdAt,
                deliveryAddress: order.deliveryAddress
            })))
            return res.status(200).json(filterOrder)
        }


    } catch (error) {
        return res.status(500).json({ message: `${error.message} you got error in get my order` })
    }
}


export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params
        const { status } = req.body
        const order = await Order.findById(orderId)

        const shopOrder = order.shopOrders.find(o => o.shop == shopId)

        if (!shopOrder) {
            return res.status(400).json({ message: "shop order not found" })
        }
        shopOrder.status = status

        // make a payload

        let deliveryBoyPayload = []

        if (status == "out of delivery" && !shopOrder.assignment) {
            const { longitude, latitude } = order.deliveryAddress
            //  lets find out those delivery boys whose are colsest 5km to the user who order 
            const nearbyDeliveryBoys = await User.find({
                role: "delivaryBoy",
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
                        $maxDistance: 5000
                    }
                }
            })

            // then for those newbydelevery bosy we need to find out those boys whose are free now
            const nearById = nearbyDeliveryBoys.map(b => b._id)
            const busyDBoysId = await DeliveryAssignment.find({
                assignedTo: { $in: nearById },
                status: { $nin: ["brodcasted", "completted"] }
            }).distinct("assignedTo")

            const busyIdSet = new Set(busyDBoysId.map(id => String(id)))
            const availableBoys = nearbyDeliveryBoys.filter(b => !busyIdSet.has(String(b._id)))

            const candidates = availableBoys.map(b => b._id)

            if (candidates.length == 0) {
                await order.save()
                return res.json({
                    message: "order status updated but there is no deleviry boys"
                })
            }



            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder._id,
                brodcastedTo: candidates,
                status: "brodcasted"
            })

            shopOrder.assignedDeliveryBoys = deliveryAssignment.assignedTo
            shopOrder.assignment = deliveryAssignment._id

            deliveryBoyPayload = availableBoys.map(b => ({
                id: b._id,
                fullName: b.fullName,
                longitude: b.location.coordinates?.[0],
                latitude: b.location.coordinates?.[1],
                mobile: b.mobile
            }))


            // this is for socket io for delivery boy to see the order instade
            await deliveryAssignment.populate('order')
            await deliveryAssignment.populate('shop')
            const io = req.app.get('io')
            if (io) {
                availableBoys.forEach(boy => {
                    const deliveryBoySocketId = boy.socketId
                    if (deliveryBoySocketId) {
                        io.to(deliveryBoySocketId).emit('newAssignment', {
                            sentTo: boy._id,
                            assignmentId: deliveryAssignment._id,
                            orderId: deliveryAssignment.order._id,
                            shopName: deliveryAssignment.shop.name,
                            deliveryAddress: deliveryAssignment.order.deliveryAddress,
                            items: deliveryAssignment.order.shopOrders.find(so => so._id.equals(deliveryAssignment.shopOrderId)).shopOrderItems || [],
                            subTotal: deliveryAssignment.order.shopOrders.find(so => so._id.equals(deliveryAssignment.shopOrderId))?.subTotal || [],
                        })
                    }
                })
            }


        }

        await shopOrder.save()
        await order.save()

        const updatedShopOrder = order.shopOrders.find(o => o.shop == shopId)
        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.assignedDeliveryBoys", "fullName email mobile")

        // this is for socket io insade update
        await order.populate("user", "socketId")
        const io = req.app.get('io')
        if (io) {
            const userSocketId = order.user.socketId
            if (userSocketId) {
                io.to(userSocketId).emit('update-status', {
                    orderId: order._id,
                    shopId: updatedShopOrder.shop._id,
                    status: updatedShopOrder.status,
                    userId: order.user._id
                })
            }
        }



        return res.status(200).json({
            shopOrder: updatedShopOrder,
            assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoys,
            availableBoys: deliveryBoyPayload,
            assignment: updatedShopOrder?.assignment._id
        })
    } catch (error) {
        return res.status(500).json({ message: `${error.message} you got error in update status order` })
    }
}



export const getDeliveryBoyAssignment = async (req, res) => {
    try {
        const deliveryBoyId = req.userId
        const assignments = await DeliveryAssignment.find({
            brodcastedTo: deliveryBoyId,
            status: "brodcasted",
        })
            .populate("order")
            .populate("shop")


        const formattedData = assignments.map(a => ({
            assignmentId: a._id,
            orderId: a.order._id,
            shopName: a.shop.name,
            deliveryAddress: a.order.deliveryAddress,
            items: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId)).shopOrderItems || [],
            subTotal: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId))?.subTotal || [],
        }))
        return res.status(200).json(formattedData)
        // return res.status(200).json({formattedData, message: "hi"})

    } catch (error) {
        return res.status(500).json({ message: `${error.message} you got error in getDeliveryBoyAssignment` })
    }
}


export const acceptOrder = async (req, res) => {
    try {
        const { assignmentId } = req.params
        const assignment = await DeliveryAssignment.findById(assignmentId)
        if (!assignment) {
            return res.status(400).json({ message: "assignment not found" })
        }
        if (assignment.status !== "brodcasted") {
            return res.status(400).json({ message: "assignment is expired" })
        }

        // find tshose delivery boys whos are alredy goes to a delivey and he can't accept another order unless he done this
        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: { $nin: ["brodcasted", "completted"] },

        })

        if (alreadyAssigned) {
            return res.status(400).json({ message: "you are already assigned to another order" })
        }

        assignment.assignedTo = req.userId
        assignment.status = "assigned"
        assignment.acceptedAt = new Date(),
            await assignment.save()

        const order = await Order.findById(assignment.order)
        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }
        let shopOrder = order.shopOrders.id(assignment.shopOrderId)
        shopOrder.assignedDeliveryBoys = req.userId
        await order.save()
        return res.status(200).json({
            message: "order accepted"
        })

    } catch (error) {
        return res.status(500).json({ message: `${error.message} you got error in accept order` })
    }
}


// this is for delivery boys to his order that he accepted
export const getCureentOrder = async (req, res) => {
    try {
        const assignment = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: "assigned"
        })
            .populate("shop", "name")
            .populate("assignedTo", "fullName email mobile location")
            .populate({
                path: "order",
                populate: [{ path: "user", select: "fullName email location mobile" }],
            })

        if (!assignment) {
            return res.status(400).json({ message: "assignment not found" })
        }
        if (!assignment.order) {
            return res.status(400).json({ message: "assignment order not found" })
        }

        const shopOrder = assignment.order.shopOrders.find(so => String(so._id) == String(assignment.shopOrderId))

        if (!shopOrder) {
            return res.status(400).json({ message: "shop order not found" })
        }

        // for finding delivery boys location
        let delivaryBoyLocation = { lat: null, lng: null }
        if (assignment.assignedTo.location.coordinates.length == 2) {
            delivaryBoyLocation.lat = assignment.assignedTo.location.coordinates[1]
            delivaryBoyLocation.lng = assignment.assignedTo.location.coordinates[0]
        }

        // for finding cursr address
        let customerLocation = { lat: null, lng: null }
        if (assignment.order.deliveryAddress) {
            customerLocation.lat = assignment.order.deliveryAddress.latitude
            customerLocation.lng = assignment.order.deliveryAddress.longitude
        }

        return res.status(200).json({
            _id: assignment.order._id,
            user: assignment.order.user,
            shopOrder,
            deliveryAddress: assignment.order.deliveryAddress,
            delivaryBoyLocation,
            customerLocation
        })



    } catch (error) {
        return res.status(500).json({ message: `${error.message} you got error in get current order` })
    }
}

// this is for user curstomer , when delivery send and otp to user that's how he going to get this order
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findById(orderId)
            .populate("user")
            .populate({
                path: "shopOrders.shop",
                model: "Shop"
            })
            .populate({
                path: "shopOrders.assignedDeliveryBoys",
                model: "User"
            })
            .populate({
                path: "shopOrders.shopOrderItems.item",
                model: "Item"
            })
            .lean()
        if (!order) {
            return res.status(400).json({ message: " order not found" })
        }
        return res.status(200).json(order)
    } catch (error) {
        return res.status(500).json({ message: `${error.message} you got error in get current order by id for user customer` })
    }
}

// this is for send otp 
export const sendDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body
        const order = await Order.findById(orderId).populate("user")
        const shopOrder = order.shopOrders.id(shopOrderId)

        if (!order || !shopOrder) {
            return res.status(400).json({ messge: "enter vaild order/shoporder id" })
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        shopOrder.deliveryOtp = otp
        shopOrder.otpExpires = Date.now() + 5 * 60 * 1000
        await order.save()

        await sendDeliveryOtpMail(order.user, otp)

        return res.status(200).json({ message: `Otp send Succesfully ${order?.user.fullName}` })

    } catch (error) {
        return res.status(500).json({ message: `${error.message} you got error in send delivery otp` })
    }
}

// this is for check the delivery boy top
export const verifyDBOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId, otp } = req.body
        const order = await Order.findById(orderId).populate("user")
        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!order || !shopOrder) {
            return res.status(400).json({ messge: "enter vaild order/shoporder id" })
        }

        if (shopOrder.deliveryOtp != otp || !shopOrder.otpExpires || shopOrder < Date.now()) {
            return res.status(400).json({ message: "Invalid/Expired otp" })
        }
        shopOrder.status = "deliverd"
        shopOrder.deliveredAt = Date.now()

        await order.save()

        await DeliveryAssignment.deleteOne({
            shopOrderId: shopOrder._id,
            order: order._id,
            assignedTo: shopOrder.assignedDeliveryBoys
        })

        return res.status(200).json({ message: "Order deliverd Successfully" })

    } catch (error) {
        return res.status(500).json({ message: `${error.message} you got error in check delivery otp` })
    }
}


export const deliveryBoyEarnings = async (req, res) => {
    try {
        const deliveryBoyId = req.userId
        const startsOfDay = new Date() 
        startsOfDay.setHours(0,0,0,0)
        const orders = await Order.find({
            "shopOrders.assignedDeliveryBoys": deliveryBoyId,
            "shopOrders.status": "deliverd",
            "shopOrders.deliveredAt": {$gte: startsOfDay}
        }).lean()

        let todaysDeliverys = []
        orders.forEach(order => {
            order.shopOrders.forEach(shopOrder => {
                if(shopOrder.assignedDeliveryBoys == deliveryBoyId && 
                    shopOrder.status == "deliverd" &&
                    shopOrder.deliveredAt >=startsOfDay
                ){
                    todaysDeliverys.push(shopOrder)
                }
            })
        })

        const stats = {}
        todaysDeliverys.forEach((shopOrder => {
            const hour = new Date(shopOrder.deliveredAt).getHours()
            stats[hour]= (stats[hour]  || 0) +1
        }))

        let formattedStats = Object.keys(stats).map(hour => ({
            hour: parseInt(hour),
            count: stats[hour]
        }))
        
        
        formattedStats.sort((a, b) => a.hour- b.hour)
        return res.status(200).json(formattedStats)
    } catch (error) {
        return res.status(500).json({ message: `${error.message} you got error in delivery boy earnings` })
    }
}