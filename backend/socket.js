import User from "./model/userModel.js"

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    socket.on('identity', async ({ userId }) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          socketId: socket.id,
          isOnline: true
        }, { new: true })
      } catch (error) {
        console.log(error)
      }
    })

    // for update location
    // this is a listner who listen the emit whose comes from the backend in delivery boy
    socket.on('updateLocation', async ({ latitude, longitude, deliveryBoyId }) => {
      try {
        const user = await User.findByIdAndUpdate(deliveryBoyId, {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          isOnline: true,
          socketId: socket.id
        })

        // this is a emit to send to the user so that he can see the live tracking
        if (user) {
          io.emit('updateDLocation', {
            deliveryBoyId: deliveryBoyId,
            latitude,
            longitude
          })
        }




      } catch (error) {
        return
      }

    })



    socket.on('disconnect', async () => {
      try {
        await User.findOneAndUpdate({ socketId: socket.id }, {
          socketId: null,
          isOnline: false
        })
      } catch (error) {
        console.log(error)
      }
    })
  })
}