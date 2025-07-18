import express from 'express'
import connectDB from './config/connectDB.js'
import 'dotenv/config'
import userAuthRouter from './routes/auth/userAuth.Router.js'

import cookieParser from 'cookie-parser'
import requestIp from "request-ip"
import userRoutes from './routes/user/userRoutes.js'


const app = express()
connectDB()

app.use(express.json())
app.use(cookieParser())
// Get client ip
app.use(requestIp.mw())


//API Routes
app.use('/api', userAuthRouter);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})