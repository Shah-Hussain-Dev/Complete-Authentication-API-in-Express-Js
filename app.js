import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import connectDB from './config/db.js'
import router from './routes/index.js'
dotenv.config()
const app = express()
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL



//CORS policy
app.use(cors())
//DATABASE connection
connectDB(DB_URL)
//json load
app.use(express.json())
//loads routes
app.use('/api/user',router)

//loads json
app.use(express.json())
app.listen(PORT,()=>{
    console.log(`Server is on PORT http://localhost:${PORT}`)    
})