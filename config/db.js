import mongoose from 'mongoose'

const connectDB =async(DATABASE_URL)=>{
try {
    const options={
        dbName:'quickKart'
    }
    await mongoose.connect(DATABASE_URL,options)
    console.log("DB connected")
} catch (error) {
    console.log('Error',error)
}
}


export default connectDB