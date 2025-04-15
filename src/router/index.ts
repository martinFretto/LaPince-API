import { Router } from 'express';
import { authRouter } from './authRouter';
import { budgetRouter } from './budgetRouter';

const router = Router();

router.use("/auth", authRouter);
router.use("/budgets", budgetRouter)

export { router };