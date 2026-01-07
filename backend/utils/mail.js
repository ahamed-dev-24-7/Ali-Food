import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendMail = async (to , otp) =>{
   await transporter.sendMail({
    from: process.env.EMAIL,
    to: to,
    subject: "Password Reset OTP",
    html: `<p> Your OTP for password reset is <b> ${otp} <b/> it expires in 5 minites </p>`
   })
}


export const sendDeliveryOtpMail = async (user , otp) =>{
   await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Delivery OTP",
    html: `<p> Your OTP for delivery <b> ${otp} <b/> it expires in 5 minites </p>`
   })
}