import { Router } from 'express';
import { authRouter } from './authRouter';
import { expenditureRouter } from './expenditureRouter';

const router = Router();

router.use("/auth", authRouter);
router.use("/", expenditureRouter)

export { router };