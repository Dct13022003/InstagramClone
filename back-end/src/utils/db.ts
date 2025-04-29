import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({})
const connectDB = async () => {
  try {
    const Mongo_uri = process.env.MONGO_URI as string
    if (Mongo_uri) await mongoose.connect(Mongo_uri)
    console.log('Database connect sucess')
  } catch (error) {
    console.log(error)
  }
}
export default connectDB
