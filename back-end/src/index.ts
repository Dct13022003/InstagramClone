import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db'
import cors from 'cors'
import userRouter from './routers/user.routers'
import { defaultErrorHandler } from './middlewares/error.middlewares'

dotenv.config({})
const PORT = process.env.PORT || 8000
const app = express()

app.use(express.json())
app.use(cookieParser())
const corsOptions = {
  origin: 'http://localhost:5173', // client url
  credentials: true // required to pass
}
app.use(cors(corsOptions))
app.use('/users', userRouter)
app.use(defaultErrorHandler)
app.listen(PORT, () => {
  connectDB()
  console.log('sever is running on port', PORT)
})
