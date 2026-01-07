import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
   name: "user",
   initialState: {
      userData: null,
      currentCity: null,
      currentState: null,
      currentAddress: null,
      shopInMyCity: [],
      itemInMyCity: [],
      cartItems: [],
      totalAmount: 0,
      myOrders: [],
      searchItem: null,
      socket: null,
      slider: false,
      allItem: [],
      allShop: []
   },
   reducers: {
      setSlider: (state, action) => {
         state.slider = action.payload
      },
      setAllItem: (state, action) => {
         state.allItem = action.payload
      },
      setAllShop: (state, action) => {
         state.allShop = action.payload
      },
      setUserData: (state, action) => {
         state.userData = action.payload
      },
      setCurrCity: (state, action) => {
         state.currentCity = action.payload
      },
      setCurrState: (state, action) => {
         state.currentState = action.payload
      },
      setCurrentAddrs: (state, action) => {
         state.currentAddress = action.payload
      },
      setShopInMyCity: (state, action) => {
         state.shopInMyCity = action.payload
      },
      setItemInMyCity: (state, action) => {
         state.itemInMyCity = action.payload
      },
      addToCart: (state, action) => {
         const cartItem = action.payload;
         const existingItem = state.cartItems.find(i => i.id === cartItem.id)
         if (existingItem) {
            existingItem.quantity += cartItem.quantity
         } else {
            state.cartItems.push(cartItem)
         }

         state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
      updateQuantity: (state, action) => {
         const { id, quantity } = action.payload;
         const item = state.cartItems.find(i => i.id === id)
         if (item) {
            item.quantity = quantity
         }
         state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
      removeItem: (state, action) => {
         state.cartItems = state.cartItems.filter(i => i.id !== action.payload)
         state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
      setMyOrders: (state, action) => {
         state.myOrders = action.payload
      },
      addMyOrderRefresh: (state, action) => {
         state.myOrders = [action.payload, ...state.myOrders]
      },
      updateOrderStatus: (state, action) => {
         const { orderId, shopId, status } = action.payload
         const order = state.myOrders.find(o => o._id == orderId)
         if (order) {
            if (order.shopOrders && order.shopOrders.shop._id == shopId) {
               order.shopOrders.status = status
            }
         }
      },
      //  this is for socket io update status
      updateRealTimeOrderStatus: (state, action) => {
         const { orderId, shopId, status } = action.payload
         const order = state.myOrders.find(o => o._id == orderId)
         if (order) {
            const shopOrder = order.shopOrders.find(so => so.shop._id == shopId)
            if (shopOrder) {
               shopOrder.status = status
            }
         }
      },
      setSearchItem: (state, action) => {
         state.searchItem = action.payload
      },
      setSocket: (state, action) => {
         state.socket = action.payload
      }

   },

})

export const { setUserData, setCurrCity, setCurrState, setCurrentAddrs, setShopInMyCity, setItemInMyCity, addToCart, updateQuantity, removeItem, setMyOrders, addMyOrderRefresh, updateOrderStatus, setSearchItem, setSocket, updateRealTimeOrderStatus, setSlider, setAllItem, setAllShop } = userSlice.actions
export default userSlice.reducer 