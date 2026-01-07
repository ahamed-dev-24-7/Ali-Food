import User from "../model/userModel.js"
import bcrypt, { hash } from "bcryptjs"
import genToken from "../utils/token.js"
import { sendMail } from "../utils/mail.js"


// controller for sign up
export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body
        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ message: "User Already Exists" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "password must be 6 charecter" })
        }

        if (mobile < 4) {
            return res.status(400).json({ message: "moble number not valid" })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        user = await User.create({
            fullName,
            email,
            password: hashPassword,
            mobile,
            role

        })

        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

      

        return res.status(201).json(user)

    } catch (error) {
        console.log(error)
    }
}


// conteroller for sign in

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "give authentic resouces" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "informaitn are wrong" })
        }


        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(200).json(user)


    } catch (error) {
        return res.status(500).json(`sign in error ${error}`)
    }
}



// controller for sign out
export const signOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "logout succesfully" })
    } catch (error) {
        return res.status(500).json({ message: "can't", error })
    }
}


// controller for send otp
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "email not exist" })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000 // 5 minutes from now
        user.isOtpVerified = false
        await user.save()
        await sendMail(email, otp)
        return res.status(200).json({ message: "otp send success" })
    } catch (error) {
        return res.status(500).json({ message: "otp not send", error })
    }
}

// controller for verify otp
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })

        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "invalid or expires otp" })
        }

        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined
        await user.save()
        return res.status(200).json({ message: "otp verified success" })
    } catch (error) {
        return res.status(500).json({ message: "otp not verified", error })
    }
}

// controller for resset password
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "otp verification required" })
        }

        const hassPasword = await bcrypt.hash(newPassword, 10)
        user.password = hassPasword
        user.isOtpVerified = false
        await user.save()
        return res.status(200).json({ message: "passwrod reset success" })

    } catch (error) {
        return res.status(500).json({ message: "reset cant possible", error })
    }
}


// controller for get google sign in user data and save to databae
export const googleAuth = async (req, res) => {
    try {
        const { fullName, email, mobile, role } = req.body
        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({
                fullName, email, mobile, role
            })
        }

        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(201).json(user)


    } catch (error) {
        return res.status(500).json({ message: "google auth in problem", error })
    }
}