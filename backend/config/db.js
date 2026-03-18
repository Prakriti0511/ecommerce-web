import mongoose from "mongoose";
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB is connected")
    } catch (error) {
        console.log("DB is not connected:", error.message)
    }
}
export default connectDB;