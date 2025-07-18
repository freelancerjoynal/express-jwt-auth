import express from 'express';
import { userData, userLogin, userRegister } from '../controllers/userController.js';
import userAuthMiddleware from '../middlewares/userAuth.middleware.js';



const userRouter = express.Router();

userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.post('/details', userAuthMiddleware, userData)


export default userRouter;
