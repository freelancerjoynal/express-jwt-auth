import express from 'express';
import userAuthMiddleware from '../../middlewares/userAuth.middleware.js';
import { refreshTokenValidate, userData, userLogin, userRegister  } from '../../controllers/auth/userAuthController.js';




const userRouter = express.Router();

userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.post('/refresh-token', refreshTokenValidate)
userRouter.get('/my-profile', userAuthMiddleware, userData)
userRouter.post('/logout', userLogout);


export default userRouter;
