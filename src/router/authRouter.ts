import { Router } from 'express';
import * as authController from '../controllers/authController';

const authRouter = Router();

authRouter.post('/login', authController.loginUser);
authRouter.post('/register', authController.registerUser);
authRouter.post('/reset_password_request', authController.resetPasswordEmail);
authRouter.patch('/set_new_password', authController.setNewPassword);

export { authRouter };