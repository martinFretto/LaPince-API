import { Router } from "express";
import * as expenditureController from '../controllers/expenditureController';
import { authMiddleware } from "../middlewares/authMiddleware";

const expenditureRouter = Router();

expenditureRouter.get("/budgets/:budget_id/expenses/", authMiddleware, expenditureController.getExpendituresByBudget);

expenditureRouter.get("/budgets/:budget_id/expenses/:expenditure_id", authMiddleware, expenditureController.getOneExpenditure);

expenditureRouter.post("/budgets/:budget_id/expenses/", authMiddleware, expenditureController.createExpenditure);

expenditureRouter.patch("/budgets/:budget_id/expenses/:expenditure_id", authMiddleware, expenditureController.updateExpenditure);

expenditureRouter.delete("/budgets/:budget_id/expenses/:expenditure_id", authMiddleware, expenditureController.deleteExpenditure);

export {expenditureRouter}