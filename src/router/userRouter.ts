import { Router } from "express";
import * as userController from '../controllers/userController';
import { authMiddleware } from "../middlewares/authMiddleware";


const userRouter = Router();

userRouter.get("/me", authMiddleware, userController.getUserInfo);
userRouter.patch("/me", authMiddleware, userController.updateUserProfile);
userRouter.patch("/me/password", authMiddleware, userController.updatePassword);
userRouter.delete("/me", authMiddleware, userController.deleteUser);

export {userRouter}