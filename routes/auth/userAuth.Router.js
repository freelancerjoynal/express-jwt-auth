import express from 'express';
import userAuthMiddleware from '../../middlewares/userAuth.middleware.js';
import { refreshTokenValidate, userLogin, userRegister, userLogout } from '../../controllers/auth/userAuthController.js';




const userAuthRouter = express.Router();


userAuthRouter.post('/register', userRegister)
userAuthRouter.post('/login', userLogin)
userAuthRouter.post('/refresh-token', refreshTokenValidate)
// userAuthRouter.get('/my-profile', userAuthMiddleware, userData)
userAuthRouter.post('/logout', userLogout);

export default userAuthRouter;
