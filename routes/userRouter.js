import express from 'express';
import { refreshTokenValidate, userData, userLogin, userRegister } from '../controllers/userController.js';
import userAuthMiddleware from '../middlewares/userAuth.middleware.js';




const userRouter = express.Router();

userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.post('/refresh-token', refreshTokenValidate)
userRouter.get('/my-profile', userAuthMiddleware, userData)


export default userRouter;
