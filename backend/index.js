import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/authRouter.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/userRoutes.js"
import shopRouter from "./routes/shopRoutes.js"
import itemRouter from "./routes/itemRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import http from "http"
import {Server} from "socket.io"
import { socketHandler } from "./socket.js"
   
connectDb()
 
const app = express()

const port = process.env.PORT


// thisis for implemnt socket io
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
    origin: "https://ali-food.onrender.com",
    credentials: true,
    methods: ['POST', 'GET']
}
})


app.set("io", io)

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "https://ali-food.onrender.com",
    credentials: true
}))     

// route
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/order", orderRoutes)


socketHandler(io)

app.get("/", (req, res) =>{
    res.send("api is runngin")
})

server.listen(port, (req, res) => {
    
    console.log("server is running ")
})

