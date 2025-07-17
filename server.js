import express from 'express'
import connectDB from './config/connectDB.js'
import 'dotenv/config'
import userRouter from './routes/UserRouter.js'


const app = express()
connectDB()

app.use(express.json())

//API Routes
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send('Hello World')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})