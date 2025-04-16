import { Router } from 'express';
import { authRouter } from './authRouter';
import { expenditureRouter } from './expenditureRouter';
import { budgetRouter } from './budgetRouter';

const router = Router();

router.use("/auth", authRouter);
router.use("/", expenditureRouter)
router.use("/budgets", budgetRouter)

export { router };