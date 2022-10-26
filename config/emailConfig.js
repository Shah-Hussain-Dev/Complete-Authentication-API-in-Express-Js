import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

//create a transporter which will send your mail
const  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass:process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

export default transporter