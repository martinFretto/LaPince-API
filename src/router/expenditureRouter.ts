import { Router } from "express";
import * as expenditureController from '../controllers/expenditureController';
import { authMiddleware } from "../middlewares/authMiddleware";
import { catchErrors } from "../middlewares/catchErrors";

const expenditureRouter = Router();

expenditureRouter.get("/budgets/:budget_id/expenses/", authMiddleware, catchErrors(expenditureController.getExpendituresByBudget));

expenditureRouter.get("/budgets/:budget_id/expenses/:expenditure_id", authMiddleware, catchErrors(expenditureController.getOneExpenditure));

expenditureRouter.post("/budgets/:budget_id/expenses/", authMiddleware, catchErrors(expenditureController.createExpenditure));

expenditureRouter.patch("/budgets/:budget_id/expenses/:expenditure_id", authMiddleware, catchErrors(expenditureController.updateExpenditure));

expenditureRouter.delete("/budgets/:budget_id/expenses/:expenditure_id", authMiddleware, catchErrors(expenditureController.deleteExpenditure));

export {expenditureRouter}