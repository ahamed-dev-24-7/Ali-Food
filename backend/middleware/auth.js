import jwt from "jsonwebtoken"

const isAuth = (req, res, next) =>{
  try {
    const token = req.cookies.token
    if(!token){
        return res.status(400).json({message: "token no found"})
    }
    const decodeToken= jwt.verify(token, process.env.JWT_SECRET)
    if(!decodeToken){
       return res.status(400).json({message: "token not verified"})    
    }
    // console.log(decodeToken)
    req.userId = decodeToken.userId
    // console.log("TOKEN:", req.cookies.token)
    // console.log("USER ID:", decodeToken.userId)

    next()
  } catch (error) {
    return res.status(500).json({message: error +"error in auth"})
  }
}

export default isAuth


