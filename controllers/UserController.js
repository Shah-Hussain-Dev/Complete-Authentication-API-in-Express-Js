import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../config/emailConfig.js'
class UserController {
  static userRegistration = async (req,res)=>{
    const {name,email,password, password_confirmation,tc} = req.body
    const user = await UserModel.findOne({email:email})
    if(user){
      res.send({"status":"failed","message":"User already exists"})
    }else{
      if(name && email && password && password_confirmation && tc){
        if(password===password_confirmation){
          try {
            const salt =await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password,salt);
            const doc = await new UserModel({
              name:name,
              email:email,
              password:hashPassword,
              tc:tc          
            })
            await doc.save()
            const saved_user = await UserModel.findOne({email:email});
            //generate JWT token
            const token  = jwt.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:"5d"})
            res.status(201).send({"status":"success","message":"User Registered successfully","token":token})
          } catch (error) {
            res.status(404).send({"status":"failed","message":"Unable to register user"})
            console.log(error)
          }
        }else{
          res.status(404).send({"status":"failed","message":"Password and Confirm password doesn't match"})
        }
    }else{
      res.status(404).send({"status":"failed","message":"All fields are required"})
    }
  }
}

static userLogin = async(req,res)=>{
  try {
    const {email,password} = req.body
    if(email && password){
      const user = await UserModel.findOne({email:email})
      if(user != null){
        const isMatch = await bcrypt.compare(password,user.password)
        if((user.email === email) && isMatch){
          const token  = jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"5d"})
          res.send({"status":"success","message":"Login Successfully!","token":token})
        }else{
          res.status(404).send({"status":"failed","message":"Email or Password Invalid"})
        }
      }else{
        res.status(404).send({"status":"failed","message":"You are not a registered user"})
      }
    }else{
      res.status(404).send({"status":"failed","message":"All fields are required"})
    }
  } catch (error) {
    console.log(error)
  }
}

static changePassword = async(req,res)=>{
  const {password,password_confirmation} = req.body
  if(password && password_confirmation){
    if(password=== password_confirmation){
      const salt  = await bcrypt.genSalt(10)
      const newHashPassword = await bcrypt.hash(password,salt)
      console.log(req.user)
      await UserModel.findByIdAndUpdate(req.user._id,{$set:{password:newHashPassword}})
      res.send({"status":"success","message":"password changed successfully!"})
    }else{
      res.status(404).send({"status":"failed","message":"Password and Confirm Password does not match"})
    }
  }else{
    res.status(404).send({"status":"failed","message":"All fields are required"})
  }
}

  static loggedUser = async(req,res)=>{
    res.send({"user":req.user})
  }

  static userPasswordResetEmailSend =async (req,res)=>{
    const {email} = req.body;
    if(email){
      const user = await UserModel.findOne({email: email});
      if(user){
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({userID:user._id},secret,{expiresIn:"15m"})
        const link = `https://localhost:3000/api/user/reset-password/${user._id}/${token}`

        //send mail for reset password
        const info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject:"Quick-Kart: Password Reset!",
          html:`<a href=${link}}>Click here to reset password</a>`
        })
        res.send({"status":"success","message":"Password Reset Email sent... Please check your email."," info":info})
        console.log(token)
        console.log(link)

      }else{
        res.send({"status":"failed","message":"Email not Registered!"})
      }
    }else{
      res.send({"status":"failed","message":"Please enter your email address"})
    }
  }

  static userPasswordReset = async (req,res)=>{
    const {password,password_confirmation} = req.body;
    const {id,token} = req.params;
    const user = await UserModel.findById(id)
    const new_secret = user._id+process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token,new_secret);
      if(password && password_confirmation){
        if(password === password_confirmation){
          const salt  = await bcrypt.genSalt(10)
          const newHashPassword = await bcrypt.hash(password,salt)
          await UserModel.findByIdAndUpdate(user._id,{$set:{password:newHashPassword}})
          res.send({"status":"success","message":"Password Reset Successfully"})
        }else{
          res.status(404).send({"status":"failed","message":"Password and Confirm Password doesn't match"})
        }
      }else{
        res.status(404).send({"status":"failed","message":"All fields are required"})
      }
    } catch (error) {
      res.send({"status":"failed","message":"Invalid token"})
      console.log(error)
    }
  }
}


export default UserController