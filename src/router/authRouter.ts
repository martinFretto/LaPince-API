import { Router } from 'express';
import * as authController from '../controllers/authController';
import { catchErrors } from '../middlewares/catchErrors';

const authRouter = Router();

authRouter.post('/login', catchErrors(authController.loginUser));
authRouter.post('/register', catchErrors(authController.registerUser));

export { authRouter };