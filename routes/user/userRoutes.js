import express from 'express';
import userAuthMiddleware from '../../middlewares/userAuth.middleware.js';
import { userData } from '../../controllers/user/usercontroller.js';



const userRoutes = express.Router();

userRoutes.get('/user/profile', userAuthMiddleware, userData)


export default userRoutes;
