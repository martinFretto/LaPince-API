import { Router } from 'express';
import * as authController from '../controllers/authController';
import { catchErrors } from '../middlewares/catchErrors';

const authRouter = Router();

authRouter.post('/login', authController.loginUser);
authRouter.post('/register', authController.registerUser);

export { authRouter };