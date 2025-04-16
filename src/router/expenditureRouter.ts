import { Router } from "express";
import * as expenditureController from '../controllers/expenditureController';

const expenditureRouter = Router();


expenditureRouter.get("/budgets/:budget_id/expenses/", expenditureController.getExpendituresByBudget);

expenditureRouter.get("/budgets/:budget_id/expenses/:expenditure_id", expenditureController.getOneExpenditure);

expenditureRouter.post("/budgets/:budget_id/expenses/", expenditureController.createExpenditure);

expenditureRouter.patch("/budgets/:budget_id/expenses/:expenditure_id", expenditureController.updateExpenditure);

expenditureRouter.delete("/budgets/:budget_id/expenses/:expenditure_id", expenditureController.deleteExpenditure);

export {expenditureRouter}