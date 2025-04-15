import { Router } from "express";
import * as budgetController from '../controllers/budgetController';

const budgetRouter = Router();


budgetRouter.get("/", budgetController.getAllBudgets);

budgetRouter.get("/:id", budgetController.getBudgetById);

budgetRouter.post("/", budgetController.createBudget);

budgetRouter.patch("/:id", budgetController.updateBudget);

budgetRouter.delete("/:id", budgetController.deleteBudget);

export {budgetRouter}