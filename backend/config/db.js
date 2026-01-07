import mongoose from "mongoose"


const connectDb = async () =>{
   try {
    await mongoose.connect(process.env.MONGODB_URL) 
   // await mongoose.connect('mongodb://127.0.0.1:27017/ali-food')
    console.log("db connectore")
   } catch (error) {
    console.log(error)
   }
}


export default connectDb