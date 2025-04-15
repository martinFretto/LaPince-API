import { Router } from "express";
import * as expenditureController from '../controllers/expenditureController';

const expenditureRouter = Router();


//expenditureRouter.get("/", expenditureController.getExpenditures);

//expenditureRouter.get("/:expenditure_id", expenditureController.getExpenditureById);

expenditureRouter.post("/budgets/:budget_id/expenses/", expenditureController.createExpenditure);

//expenditureRouter.patch("/:expenditure_id", expenditureController.updateExpenditure);

//expenditureRouter.delete("/:expenditure_id", expenditureController.deleteExpenditure);

export {expenditureRouter}