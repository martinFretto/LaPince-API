import { Router } from "express";
import * as budgetController from '../controllers/budgetController';

const budgetRouter = Router();


budgetRouter.get("/user/:userId", budgetController.getAllBudgets);

budgetRouter.get("/:id", budgetController.getBudgetById);

budgetRouter.post("/", budgetController.createBudget);

budgetRouter.put("/:id", budgetController.updateBudget);

budgetRouter.delete("/:id", budgetController.deleteBudget);

export {budgetRouter}